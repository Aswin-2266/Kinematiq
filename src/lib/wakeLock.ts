// Kinematiq Mobile Screen Wake Lock Manager
// Prevents mobile screens from auto-locking or sleeping during workouts

class WakeLockManager {
  private sentinel: WakeLockSentinel | null = null;
  private isRequested: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = async (): Promise<void> => {
    if (this.isRequested && document.visibilityState === "visible") {
      await this.request();
    }
  };

  public async request(): Promise<boolean> {
    if (typeof window === "undefined" || !("wakeLock" in navigator)) {
      return false;
    }

    try {
      this.isRequested = true;
      if (!this.sentinel || this.sentinel.released) {
        this.sentinel = await navigator.wakeLock.request("screen");
        this.sentinel.addEventListener("release", () => {
          this.sentinel = null;
        });
      }
      return true;
    } catch (err) {
      console.warn("Screen Wake Lock could not be acquired:", err);
      return false;
    }
  }

  public async release(): Promise<void> {
    this.isRequested = false;
    if (this.sentinel && !this.sentinel.released) {
      try {
        await this.sentinel.release();
        this.sentinel = null;
      } catch {
        // Ignore
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== "undefined" && "wakeLock" in navigator;
  }
}

export const wakeLockManager = new WakeLockManager();
