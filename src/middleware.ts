import { NextRequest, NextResponse } from "next/server";
import { geturl } from "./lib/get-url";

export default function middeleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  console.log({
    token,
    pathname,
  });

  if (request.nextUrl.pathname.startsWith("/register") && token) {
    return NextResponse.redirect(new URL("/app/home", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/app") && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
