import { Colors } from './gameLogic';

const FREQUENCIES: Record<Colors, number> = {
  [Colors.GREEN]: 415,  // G#4
  [Colors.RED]: 310,    // D#4
  [Colors.YELLOW]: 252, // B3
  [Colors.BLUE]: 209,   // G#3
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = true;

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(color: Colors | 'error', durationMs: number = 300) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (color === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(42, this.ctx.currentTime); // Low buzz
      gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(FREQUENCIES[color], this.ctx.currentTime);
      gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    }

    // Envelope para evitar "clicks" no início e fim do som
    gain.gain.setTargetAtTime(0, this.ctx.currentTime + (durationMs / 1000) - 0.05, 0.015);

    osc.start();
    osc.stop(this.ctx.currentTime + (durationMs / 1000));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.init();
    }
    return this.isMuted;
  }
}

export const audio = new AudioEngine();
