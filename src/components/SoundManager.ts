// Web Audio API browser synthesizer for "Dasturchilar Jangi — 40 Million"
// Generates dramatic, high-tension game show sound effects programmatically

class GameSoundManager {
  private audioCtx: AudioContext | null = null;

  private initCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // Play button click
  playClick() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Context sound failed:", e);
    }
  }

  // Play clock tick sound
  playTick(volumeScale: number = 0.05) {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1000, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(volumeScale, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio failure
    }
  }

  // Play correct answer sound
  playCorrect() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5 arpeggio

      notes.forEach((freq, index) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.08, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.4);
      });
    } catch (e) {
      // Ignore
    }
  }

  // Play wrong answer / buzzer sound
  playWrong() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.linearRampToValueAtTime(90, now + 0.6);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(135, now);
      osc2.frequency.linearRampToValueAtTime(95, now + 0.6);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);
    } catch (e) {
      // Ignore
    }
  }

  // Play joker used sound
  playJoker() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {
      // Ignore
    }
  }

  // Play grand victory fanfare
  playVictory() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50]; // C5 to C6
      
      scale.forEach((freq, index) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + index * 0.15);

        gain.gain.setValueAtTime(0.08, now + index * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.15 + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + index * 0.15);
        osc.stop(now + index * 0.15 + 0.6);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const soundManager = new GameSoundManager();
