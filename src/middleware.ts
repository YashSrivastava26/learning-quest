import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  const pathname = await req.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/gallery", req.url));
  }
});

export const config = {
  matcher: ["/"],
};
