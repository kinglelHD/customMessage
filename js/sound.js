let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let gainNode;
let audioSource;

// SFX file paths
/* const SFX_FILES = {
    typing: "sounds/typing.wav",
    click: "sounds/button-click.wav",
    bleep: "sounds/bleep.wav"
}; */

/* function playTypingSound() {
    if (!SFX.typing) return;

    const src = audioCtx.createBufferSource();
    src.buffer = SFX.typing;

    const randomPitch = 0.95 + Math.random() * 0.1;
    src.playbackRate.value = randomPitch;

    src.connect(audioCtx.destination);
    src.start(0);
} */


const SFX = {};

async function loadSFX(key, url) {
    const res = await fetch('./assets/' + url);
    const buf = await res.arrayBuffer();
    SFX[key] = await audioCtx.decodeAudioData(buf);
}

// Play any loaded SFX buffer
function playSFX(key) {
    if (!SFX[key]) return;
    const src = audioCtx.createBufferSource();
    src.buffer = SFX[key];
    src.connect(audioCtx.destination);
    src.start(0);
}

function fade(duration = 2, targetVolume = 1) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + duration);
}