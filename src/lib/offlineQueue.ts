import { WorkoutSession } from "@/types";

const OFFLINE_STORAGE_KEY = "kinematiq_workout_history_v1";

export function getLocalSessions(): WorkoutSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read local workout history:", err);
    return [];
  }
}

export function saveLocalSession(session: WorkoutSession): WorkoutSession[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getLocalSessions();
    const updated = [session, ...current.filter((s) => s.id !== session.id)];
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Could not save workout locally:", err);
    return [];
  }
}

export function markSessionSynced(sessionId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalSessions();
    const updated = current.map((s) =>
      s.id === sessionId ? { ...s, syncedToCloud: true } : s
    );
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not update sync state:", err);
  }
}

export async function syncPendingSessions(): Promise<{ syncedCount: number }> {
  if (typeof window === "undefined") return { syncedCount: 0 };
  const allSessions = getLocalSessions();
  const pending = allSessions.filter((s) => !s.syncedToCloud);

  if (pending.length === 0) return { syncedCount: 0 };

  let syncedCount = 0;
  for (const session of pending) {
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(session),
      });

      if (res.ok) {
        markSessionSynced(session.id);
        syncedCount++;
      }
    } catch {
      // Still offline or DB unavailable; leave in pending state
      break;
    }
  }

  return { syncedCount };
}
