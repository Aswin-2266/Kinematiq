// Kinematiq Web Speech API Voice Coach
// Provides spoken workout prompts and upcoming exercise announcements

class VoiceCoach {
  private isAvailable: boolean = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.isAvailable = true;
    }
  }

  // Pre-warms the speech synthesis engine on mobile user interaction
  public unlock(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  public speak(text: string, enabled: boolean): void {
    if (!enabled) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      // Cancel previous utterances to avoid speech queue lag
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly brisk, athletic pacing
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Siri"))
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
    }
  }

  // Common coaching calls
  public announceExerciseStart(exerciseName: string, durationSeconds: number, enabled: boolean): void {
    this.speak(`Work! ${exerciseName}. ${durationSeconds} seconds.`, enabled);
  }

  public announceRest(nextExerciseName: string, restSeconds: number, enabled: boolean): void {
    this.speak(`Rest for ${restSeconds} seconds. Next up: ${nextExerciseName}.`, enabled);
  }

  public announceRoundBreak(completedRound: number, totalRounds: number, breakSeconds: number, enabled: boolean): void {
    this.speak(`Round ${completedRound} of ${totalRounds} complete! Recover for ${breakSeconds} seconds.`, enabled);
  }

  public announceWorkoutComplete(enabled: boolean): void {
    this.speak("Workout complete! Outstanding effort.", enabled);
  }
}

export const voiceCoach = new VoiceCoach();
