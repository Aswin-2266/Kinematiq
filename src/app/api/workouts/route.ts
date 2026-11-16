import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { WorkoutSession } from "@/models/WorkoutSession";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Cloud database not connected, using client storage" },
        { status: 503 }
      );
    }

    const sessions = await WorkoutSession.find().sort({ completedAt: -1 }).limit(50);
    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { error: "Cloud database not connected, session queued locally" },
        { status: 503 }
      );
    }

    const newSession = await WorkoutSession.create({
      userId: body.userId || null,
      routineId: body.routineId || "",
      routineTitle: body.routineTitle || "15-Minute Full-Body Circuit",
      startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      completedAt: body.completedAt ? new Date(body.completedAt) : new Date(),
      totalSeconds: body.totalSeconds || 0,
      completedRounds: body.completedRounds || 1,
      completedExercises: body.completedExercises || 6,
      estimatedCalories: body.estimatedCalories || 0,
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, session: newSession }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error saving workout session";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
