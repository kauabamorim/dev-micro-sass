import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export default function middleware(request: NextRequest) {
  const cookie = request.cookies.get("token");
  const pathname = request.nextUrl.pathname;

  const token = cookie ? cookie.value : null;

  console.log({
    token,
    pathname,
  });

  const verifyTokenUser = token ? verifyToken(token) : null;

  if (pathname.startsWith("/app") && !verifyTokenUser) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && verifyTokenUser) {
    return NextResponse.redirect(new URL("/app/home", request.url));
  }

  return NextResponse.next();
}
