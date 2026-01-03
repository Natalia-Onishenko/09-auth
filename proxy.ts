import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";
import type { AxiosResponse } from "axios";
import type { User } from "./types/user";

const PRIVATE_PREFIXES = ["/profile", "/notes"] as const;
const AUTH_ROUTES = ["/sign-in", "/sign-up"] as const;

function isPrivateRoute(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((p) => pathname === p);
}

function normalizeSetCookieHeader(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return [];
}

function applySetCookieHeaders(res: NextResponse, setCookies: string[]): NextResponse {
  for (const c of setCookies) res.headers.append("set-cookie", c);
  return res;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivate = isPrivateRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  let isAuthenticated = false;
  let setCookies: string[] = [];

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    try {
      const cookieHeader = req.headers.get("cookie") ?? "";
      const response: AxiosResponse<User | null> = await checkSession(cookieHeader);
      isAuthenticated = Boolean(response.data);

      const responseSetCookie = (response.headers as Record<string, unknown>)["set-cookie"];
      setCookies = normalizeSetCookieHeader(responseSetCookie);
    } catch {
      isAuthenticated = false;
      setCookies = [];
    }
  }

  if (isPrivate && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return applySetCookieHeaders(NextResponse.redirect(url), setCookies);
  }

  if (isAuth && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return applySetCookieHeaders(NextResponse.redirect(url), setCookies);
  }

  return applySetCookieHeaders(NextResponse.next(), setCookies);
}