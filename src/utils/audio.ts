/**
 * Procedural audio synthesis using Web Audio API
 * Generates sounds for tile spawns and merges
 */

import { useSettingsStore } from '../store/settingsStore';

// Audio context singleton
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a tone with specified parameters
 */
function playTone(
  frequency: number,
  duration: number,
  volume: number,
  waveType: OscillatorType = 'sine'
): void {
  const settings = useSettingsStore.getState();
  if (!settings.audioEnabled) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = waveType;
    oscillator.frequency.value = frequency;

    // Apply volume settings
    const finalVolume = volume * settings.volume;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

/**
 * Play sound when a new tile spawns
 */
export function playSpawnSound(value: number): void {
  // Base frequency increases slightly with tile value
  const baseFrequency = 200 + Math.log2(value) * 20;
  playTone(baseFrequency, 0.15, 0.15, 'sine');
}

/**
 * Play sound when tiles merge
 * Higher values = higher pitch
 */
export function playMergeSound(value: number): void {
  const settings = useSettingsStore.getState();
  if (!settings.audioEnabled) return;

  try {
    const ctx = getAudioContext();

    // Frequency increases logarithmically with tile value
    const frequency = 200 + Math.log2(value) * 80;

    // Create two oscillators for richer sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Main tone
    osc1.type = 'sine';
    osc1.frequency.value = frequency;

    // Harmonic (octave up)
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 1.5;

    // Volume envelope
    const finalVolume = 0.2 * settings.volume;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.25);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

/**
 * Play sound when player moves (soft click)
 */
export function playMoveSound(): void {
  playTone(150, 0.05, 0.08, 'square');
}

/**
 * Play sound when player wins (ascending arpeggio)
 */
export function playWinSound(): void {
  const settings = useSettingsStore.getState();
  if (!settings.audioEnabled) return;

  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, index) => {
    setTimeout(() => {
      playTone(freq, 0.3, 0.15, 'sine');
    }, index * 100);
  });
}

/**
 * Play sound when player loses (descending tone)
 */
export function playLoseSound(): void {
  const settings = useSettingsStore.getState();
  if (!settings.audioEnabled) return;

  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';

    // Descending pitch
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    const finalVolume = 0.15 * settings.volume;
    gainNode.gain.setValueAtTime(finalVolume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

/**
 * Resume audio context if suspended (required for user interaction)
 */
export function resumeAudioContext(): void {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}
