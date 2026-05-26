import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Allow all traffic seamlessly (disable auth routing restrictions)
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
