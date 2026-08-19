import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const disabledRoutes = ["/bill", "/receipt"];

export function proxy(request: NextRequest) {
  if (disabledRoutes.some((r) => request.nextUrl.pathname.startsWith(r))) {
    return new NextResponse(null, { status: 404 });
    // or: return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/bill/:path*", "/receipt/:path*"],
};
