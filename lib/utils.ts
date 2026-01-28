import { NextRequest } from "next/server";
import { nanoid } from "nanoid";

export function generatePasteId(): string {
  return nanoid(10);
}

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return `http://localhost:${process.env.PORT || 3000}`;
}

let testNowMs: number | null = null;

export function setTestTime(ms: number) {
  testNowMs = ms;
}

export function clearTestTime() {
  testNowMs = null;
}

export function getCurrentTime(): Date {
  if (process.env.TEST_MODE === "1" && testNowMs !== null) {
    return new Date(testNowMs);
  }
  return new Date();
}

export function extractTestTimeFromRequest(req: NextRequest): number | null {
  if (process.env.TEST_MODE === "1") {
    const testNowMsHeader = req.headers.get("x-test-now-ms");
    if (testNowMsHeader) {
      const ms = parseInt(testNowMsHeader, 10);
      if (!isNaN(ms) && ms > 0) {
        return ms;
      }
    }
  }
  return null;
}
