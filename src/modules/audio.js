/**
 * audio.js — Ambient sound toggle (Howler.js)
 * User-triggered only. Lazy loads on first click.
 */
import { Howl } from 'howler';

let sound   = null;
let playing = false;

export function initAudio() {
  const btn    = document.getElementById('audio-btn');
  const iconOn  = document.getElementById('audio-icon-on');
  const iconOff = document.getElementById('audio-icon-off');

  btn.addEventListener('click', () => {
    if (!sound) {
      sound = new Howl({
        src: ['/audio/ambient-wind.mp3'],
        loop: true, volume: 0,
        onloaderror: () =>
          console.info('%c🔇 Add /public/audio/ambient-wind.mp3 to enable ambient sound.', 'color:#E8834E'),
      });
    }
    if (playing) {
      sound.fade(sound.volume(), 0, 700);
      setTimeout(() => sound.pause(), 720);
      playing = false;
      iconOn.style.display  = 'none';
      iconOff.style.display = 'block';
      btn.dataset.on = 'false';
    } else {
      sound.play();
      sound.fade(0, 0.22, 900);
      playing = true;
      iconOff.style.display = 'none';
      iconOn.style.display  = 'block';
      btn.dataset.on = 'true';
    }
  });
}
