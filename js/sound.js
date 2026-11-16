let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let gainNode;
let audioSource;

const SFX = {};

async function loadSFX(key, url) {
    const res = await fetch('./assets/' + url);
    const buf = await res.arrayBuffer();
    SFX[key] = await audioCtx.decodeAudioData(buf);
}

// Play any loaded SFX buffer
function playSFX(key, randomPitch = true) {
    if (!SFX[key]) return;
    const src = audioCtx.createBufferSource();
    src.buffer = SFX[key];
    if (randomPitch) src.playbackRate.value = 0.95 + Math.random() * 0.1;
    src.connect(audioCtx.destination);
    src.start(0);
}

function fade(duration = 2, targetVolume = 1) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + duration);
}