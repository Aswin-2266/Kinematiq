import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Routine } from "@/models/Routine";
import { DEFAULT_ROUTINE } from "@/data/defaultRoutine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, routines: [DEFAULT_ROUTINE] });
    }

    const customRoutines = await Routine.find().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      routines: [DEFAULT_ROUTINE, ...customRoutines],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching routines";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Database offline. Routine saved locally on device." },
        { status: 503 }
      );
    }

    const created = await Routine.create({
      title: body.title || "Custom Circuit",
      description: body.description || "",
      isDefault: false,
      workDurationSeconds: body.workDurationSeconds || 40,
      restDurationSeconds: body.restDurationSeconds || 20,
      roundBreakDurationSeconds: body.roundBreakDurationSeconds || 60,
      totalRounds: body.totalRounds || 3,
      exercises: body.exercises || DEFAULT_ROUTINE.exercises,
    });

    return NextResponse.json({ success: true, routine: created }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating routine";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
