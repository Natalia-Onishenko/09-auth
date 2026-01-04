import { NextRequest, NextResponse } from "next/server";

import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/profile", "/notes"] as const;
const AUTH_ROUTES = ["/sign-in", "/sign-up"] as const;

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname as (typeof AUTH_ROUTES)[number]);
}

function toCookieHeader(req: NextRequest): string {
  const header = req.headers.get("cookie");
  return header ?? "";
}

function normalizeSetCookie(value: unknown): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    return value;
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = isPrivatePath(pathname);
  const isAuthRoute = isAuthPath(pathname);

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let isAuthenticated = false;
  let refreshedCookies: string[] = [];

  if (accessToken) {
    isAuthenticated = true;
  } else if (refreshToken) {
    try {
      const cookieHeader = toCookieHeader(req);
      const resp = await checkSession(cookieHeader);

      const setCookieRaw: unknown = (resp.headers as Record<string, unknown>)[
        "set-cookie"
      ];
      refreshedCookies = normalizeSetCookie(setCookieRaw);

      isAuthenticated = Boolean(resp.data);
    } catch {
      isAuthenticated = false;
      refreshedCookies = [];
    }
  } else {
    isAuthenticated = false;
  }

  if (isPrivate && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();

  for (const c of refreshedCookies) {
    res.headers.append("set-cookie", c);
  }

  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};