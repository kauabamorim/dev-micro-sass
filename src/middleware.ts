import { NextRequest, NextResponse } from "next/server";
import { geturl } from "./lib/get-url";

export default function middeleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  console.log({
    token,
    pathname,
  });

  if (pathname === "/register" && token) {
    return NextResponse.redirect(new URL(geturl("/app/home")));
  }

  // if (request.nextUrl.pathname.startsWith("/app") && token) {
  //   return NextResponse.rewrite(new URL("/app/home", request.url));
  // }

  if (request.nextUrl.pathname.startsWith("/app") && !token) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
}
