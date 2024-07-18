import { NextRequest, NextResponse } from "next/server";

export default function middeleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;

  console.log({
    token,
    pathname,
  });

  // if (request.nextUrl.pathname === "/" && token) {
  //   return NextResponse.redirect(new URL("/app/home", request.url));
  // }

  // if (request.nextUrl.pathname.startsWith("/app") && !token) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
}
