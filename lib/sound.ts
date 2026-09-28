// Web Audio API Synthesizer for UI sound effects (zero external asset dependencies)

class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Plays a crisp, melodic 3-tone harmonic chime for stage/task completion.
   */
  playStepComplete() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Frequencies: D5 (587.33), A5 (880.00), D6 (1174.66)
      const freqs = [587.33, 880.0, 1174.66];
      const times = [0, 0.09, 0.18];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + times[idx]);

        // Smooth volume envelope
        gain.gain.setValueAtTime(0.001, now + times[idx]);
        gain.gain.exponentialRampToValueAtTime(0.18, now + times[idx] + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + times[idx] + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + times[idx]);
        osc.stop(now + times[idx] + 0.5);
      });
    } catch {
      // Audio playback silently ignored if blocked by browser policy
    }
  }

  /**
   * Plays a celebratory fanfare chord for final pipeline completion (Stage 4 / Project export).
   */
  playTaskSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // C Major arpeggio + shimmer: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
      const notes = [
        { f: 523.25, t: 0, d: 0.4 },
        { f: 659.25, t: 0.08, d: 0.4 },
        { f: 783.99, t: 0.16, d: 0.45 },
        { f: 1046.5, t: 0.24, d: 0.7 },
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.exponentialRampToValueAtTime(0.2, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Silently ignore
    }
  }

  /**
   * Plays a subtle click/pop sound for quick actions (copying, selecting).
   */
  playNotification() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Silently ignore
    }
  }
}

export const sound = new SoundFX();
