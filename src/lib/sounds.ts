import { AmbientSound } from './types';

let audioContext: AudioContext | null = null;
let activeNodes: AudioNode[] = [];
let activeSource: AudioBufferSourceNode | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function stopAll() {
  activeNodes.forEach(node => {
    try { node.disconnect(); } catch { /* already disconnected */ }
  });
  if (activeSource) {
    try { activeSource.stop(); } catch { /* already stopped */ }
    activeSource = null;
  }
  activeNodes = [];
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playWhiteNoise(ctx: AudioContext, volume: number) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.15;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1000;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSource = source;
  activeNodes.push(source, filter, gain);
}

function playRain(ctx: AudioContext, volume: number) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.12;

  const highpass = ctx.createBiquadFilter();
  highpass.type = 'highpass';
  highpass.frequency.value = 400;

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 8000;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.3;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.03;

  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  source.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSource = source;
  activeNodes.push(source, highpass, lowpass, gain, lfo, lfoGain);
}

function playOcean(ctx: AudioContext, volume: number) {
  const buffer = createNoiseBuffer(ctx, 6);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.1;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 400;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSource = source;
  activeNodes.push(source, filter, gain, lfo, lfoGain);
}

function playForest(ctx: AudioContext, volume: number) {
  const buffer = createNoiseBuffer(ctx, 4);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.06;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 3000;
  bandpass.Q.value = 2;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 4;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);
  lfo.start();

  source.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSource = source;
  activeNodes.push(source, bandpass, gain, lfo, lfoGain);
}

function playWind(ctx: AudioContext, volume: number) {
  const buffer = createNoiseBuffer(ctx, 6);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = volume * 0.08;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();

  activeSource = source;
  activeNodes.push(source, filter, gain, lfo, lfoGain);
}

export function playSound(sound: AmbientSound, volume = 0.5): void {
  stopAll();
  if (sound === 'none') return;

  const ctx = getContext();
  if (ctx.state === 'suspended') ctx.resume();

  switch (sound) {
    case 'rain': playRain(ctx, volume); break;
    case 'whitenoise': playWhiteNoise(ctx, volume); break;
    case 'ocean': playOcean(ctx, volume); break;
    case 'forest': playForest(ctx, volume); break;
    case 'wind': playWind(ctx, volume); break;
  }
}

export function stopSound(): void {
  stopAll();
}

export function setVolume(volume: number): void {
  const gainNode = activeNodes.find(
    (n): n is GainNode => n instanceof GainNode && activeNodes.indexOf(n) <= 3
  );
  if (gainNode) {
    gainNode.gain.setValueAtTime(volume * 0.15, getContext().currentTime);
  }
}

export const soundLabels: Record<AmbientSound, string> = {
  rain: 'Pluie',
  whitenoise: 'Bruit blanc',
  ocean: 'Océan',
  forest: 'Forêt',
  wind: 'Vent',
  none: 'Silence',
};
