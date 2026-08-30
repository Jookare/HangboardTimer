import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useEffect, useRef } from 'react';

const SOURCES = {
  ready: require('@/assets/ready-beep.mp3'),
  start: require('@/assets/start-beep.mp3'),
  end: require('@/assets/end-beep.mp3'),
};

// Preloads the three timer beeps once and replays them with near-zero latency.
// Same API as the pre-2.0 hook: playSound('ready' | 'start' | 'end').
export const useSounds = () => {
  const playersRef = useRef(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

    const players = {};
    for (const [key, source] of Object.entries(SOURCES)) {
      try {
        const player = createAudioPlayer(source);
        players[key] = player;
        // Warm the audio pipeline so the *first* real cue isn't swallowed while
        // the file is still decoding (previously the first rep-rest beep was
        // silent, then every one after it worked).
        player.muted = true;
        player.play();
        setTimeout(() => {
          try {
            player.pause();
            player.seekTo(0);
            player.muted = false;
          } catch {
            // player already removed
          }
        }, 150);
      } catch (e) {
        console.warn(`useSounds: failed to load ${key}`, e);
      }
    }
    playersRef.current = players;

    return () => {
      Object.values(players).forEach((p) => {
        try {
          p.remove();
        } catch {
          // already released
        }
      });
      playersRef.current = null;
    };
  }, []);

  const playSound = (type) => {
    const player = playersRef.current?.[type];
    if (!player) return;
    try {
      player.seekTo(0);
    } catch {
      // not seekable yet — already at 0
    }
    try {
      player.play();
    } catch (e) {
      console.warn(`useSounds: failed to play ${type}`, e);
    }
  };

  return { playSound };
};
