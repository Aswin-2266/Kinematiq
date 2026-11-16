import { NextResponse } from "next/server";
import { isDatabaseConnected } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbConnected = await isDatabaseConnected();

  return NextResponse.json({
    status: "online",
    name: "Kinematiq API",
    cloudDatabase: {
      connected: dbConnected,
      message: dbConnected
        ? "Connected to MongoDB Atlas cloud database."
        : "Using resilient local offline storage (add valid MONGODB_URI to sync).",
    },
    timestamp: new Date().toISOString(),
  });
}
