import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    if (isPublicRoute) return NextResponse.redirect(new URL("/", request.url));
    if (isPrivateRoute) return NextResponse.next();
    return NextResponse.next();
  }

  if (!refreshToken) {
    if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }

  try {
    const res = await checkServerSession();
    const setCookie = res.headers?.["set-cookie"];
    const cookieArray: string[] = setCookie
      ? Array.isArray(setCookie)
        ? setCookie
        : [setCookie]
      : [];

    const hasNewAccess = cookieArray.some((c) => c.includes("accessToken="));
    const hasNewRefresh = cookieArray.some((c) => c.includes("refreshToken="));

    if (!hasNewAccess && !hasNewRefresh) {
      if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
      return NextResponse.next();
    }

    const response = isPublicRoute
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();

    for (const c of cookieArray) {
      response.headers.append("Set-Cookie", c);
    }

    return response;
  } catch {
    if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};