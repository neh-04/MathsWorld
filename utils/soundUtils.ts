// Simple synthesizer for sound effects and music to avoid external asset loading lag
let audioCtx: AudioContext | null = null;
let bgmOscillators: OscillatorNode[] = [];
let bgmGain: GainNode | null = null;
let isMuted = false;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playCorrectSound = () => {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1); // C6
  
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

export const playWrongSound = () => {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
};

export const playButtonHover = () => {
  if (isMuted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

export const playVictorySound = () => {
  if (isMuted) return;
  const ctx = getCtx();
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
  let time = ctx.currentTime;
  
  notes.forEach((note, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.value = note;
    
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.linearRampToValueAtTime(0.01, time + 0.2);
    
    osc.start(time);
    osc.stop(time + 0.2);
    time += 0.15;
  });
};

// Simple melody loop
const melody = [
  { note: 261.63, duration: 0.5 }, // C4
  { note: 329.63, duration: 0.5 }, // E4
  { note: 392.00, duration: 0.5 }, // G4
  { note: 523.25, duration: 1.0 }, // C5
  { note: 392.00, duration: 0.5 }, // G4
  { note: 329.63, duration: 0.5 }, // E4
];

let currentNoteIndex = 0;
let nextNoteTime = 0;
let isPlayingBgm = false;
let timerID: number;

const scheduleNote = () => {
  if (!isPlayingBgm || !audioCtx) return;

  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    const { note, duration } = melody[currentNoteIndex];
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = note;
    
    gain.gain.setValueAtTime(0.05, nextNoteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, nextNoteTime + duration * 0.8); // gentle fade
    
    osc.start(nextNoteTime);
    osc.stop(nextNoteTime + duration);
    
    nextNoteTime += duration;
    currentNoteIndex = (currentNoteIndex + 1) % melody.length;
  }
  
  timerID = window.setTimeout(scheduleNote, 25);
};

export const toggleBackgroundMusic = (shouldPlay: boolean) => {
  isMuted = !shouldPlay;
  const ctx = getCtx();
  
  if (shouldPlay) {
    if (!isPlayingBgm) {
      isPlayingBgm = true;
      if (ctx.state === 'suspended') ctx.resume();
      nextNoteTime = ctx.currentTime + 0.1;
      currentNoteIndex = 0;
      scheduleNote();
    }
  } else {
    isPlayingBgm = false;
    clearTimeout(timerID);
  }
};
