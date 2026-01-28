import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { ok: false },
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
