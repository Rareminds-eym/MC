// Sound utility functions for game interactions
export class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  private constructor() {
    this.initAudioContext();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'triangle':
          value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }
      
      // Apply envelope for smoother sound
      const envelope = Math.exp(-t * 3);
      data[i] = value * envelope * 0.1; // Reduce volume
    }

    return buffer;
  }

  private createComplexTone(frequencies: number[], duration: number): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      frequencies.forEach((freq, index) => {
        const amplitude = 1 / (index + 1); // Harmonics get quieter
        value += Math.sin(2 * Math.PI * freq * t) * amplitude;
      });
      
      // Normalize and apply envelope
      value = value / frequencies.length;
      const envelope = Math.exp(-t * 2);
      data[i] = value * envelope * 0.08;
    }

    return buffer;
  }

  public initSounds() {
    if (!this.audioContext) return;

    // Drag hover sound - subtle high-pitched beep
    const hoverSound = this.createTone(800, 0.1, 'sine');
    if (hoverSound) this.sounds.set('hover', hoverSound);

    // Drag start sound - ascending tone
    const dragSound = this.createComplexTone([400, 600], 0.15);
    if (dragSound) this.sounds.set('drag', dragSound);

    // Correct drop sound - success chord
    const correctSound = this.createComplexTone([523, 659, 784], 0.3); // C-E-G major chord
    if (correctSound) this.sounds.set('correct', correctSound);

    // Incorrect drop sound - error tone
    const incorrectSound = this.createComplexTone([200, 150], 0.4);
    if (incorrectSound) this.sounds.set('incorrect', incorrectSound);

    // Score increase sound - coin-like
    const scoreSound = this.createComplexTone([1047, 1319], 0.2); // High C-E
    if (scoreSound) this.sounds.set('score', scoreSound);
  }

  public playSound(soundName: string, volume: number = 0.5) {
    if (!this.audioContext || !this.sounds.has(soundName)) return;

    try {
      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = Math.min(volume, 1);
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  public resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Export convenience functions
export const soundManager = SoundManager.getInstance();

export const playHoverSound = () => soundManager.playSound('hover', 0.3);
export const playDragSound = () => soundManager.playSound('drag', 0.4);
export const playCorrectSound = () => soundManager.playSound('correct', 0.6);
export const playIncorrectSound = () => soundManager.playSound('incorrect', 0.5);
export const playScoreSound = () => soundManager.playSound('score', 0.5);