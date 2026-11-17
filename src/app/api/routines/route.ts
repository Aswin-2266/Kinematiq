import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Routine } from "@/models/Routine";
import { DEFAULT_ROUTINE } from "@/data/defaultRoutine";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function sanitizeExercises(exercises: any[]) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return DEFAULT_ROUTINE.exercises;
  }
  return exercises.map((ex, idx) => {
    const defaultEx = DEFAULT_ROUTINE.exercises[idx] || DEFAULT_ROUTINE.exercises[0];
    return {
      ...defaultEx,
      ...ex,
      alternative: (ex?.alternative && ex.alternative.name) ? ex.alternative : undefined,
      regression: (ex?.regression && ex.regression.name) ? ex.regression : undefined,
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({
        success: true,
        userRoutine: null,
        defaultRoutine: DEFAULT_ROUTINE,
      });
    }

    let userRoutine = null;
    if (userId) {
      const doc = await Routine.findOne({ userId }).sort({ updatedAt: -1 }).lean();
      if (doc) {
        userRoutine = {
          ...doc,
          exercises: sanitizeExercises(doc.exercises),
        };
      }
    }

    return NextResponse.json({
      success: true,
      userRoutine,
      defaultRoutine: DEFAULT_ROUTINE,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching routines";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    const body = await req.json();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Database offline. Routine saved locally on device." },
        { status: 503 }
      );
    }

    const cleanExercises = sanitizeExercises(body.exercises || DEFAULT_ROUTINE.exercises);

    let routineDoc;
    if (userId) {
      // Upsert custom routine for this account
      routineDoc = await Routine.findOneAndUpdate(
        { userId },
        {
          userId,
          title: body.title || "Custom Circuit",
          description: body.description || DEFAULT_ROUTINE.description,
          isDefault: false,
          workDurationSeconds: body.workDurationSeconds || 40,
          restDurationSeconds: body.restDurationSeconds || 20,
          roundBreakDurationSeconds: body.roundBreakDurationSeconds || 60,
          totalRounds: body.totalRounds || 3,
          exercises: cleanExercises,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      // Guest or public routine creation
      routineDoc = await Routine.create({
        title: body.title || "Custom Circuit",
        description: body.description || "",
        isDefault: false,
        workDurationSeconds: body.workDurationSeconds || 40,
        restDurationSeconds: body.restDurationSeconds || 20,
        roundBreakDurationSeconds: body.roundBreakDurationSeconds || 60,
        totalRounds: body.totalRounds || 3,
        exercises: cleanExercises,
      });
    }

    return NextResponse.json({ success: true, routine: routineDoc }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving routine";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
