import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Check for test mode header
  if (process.env.TEST_MODE === "1") {
    const testNowMs = request.headers.get("x-test-now-ms");
    if (testNowMs) {
      // Pass the test time to the application context
      response.headers.set("x-test-now-ms", testNowMs);
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/p/:path*"],
};
