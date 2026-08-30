import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

const SOURCES = {
  ready: require('@/assets/ready-beep.mp3'),
  start: require('@/assets/start-beep.mp3'),
  end: require('@/assets/end-beep.mp3'),
};

// Plays a player silently (volume 0) so Android fully decodes it and acquires
// audio focus. Restores the volume when it finishes (or after a timeout).
const primePlayer = (player) => {
  try {
    player.volume = 0;
    const restore = () => {
      try {
        player.pause();
        player.seekTo(0);
        player.volume = 1;
      } catch {
        // player removed
      }
    };
    const sub = player.addListener?.('playbackStatusUpdate', (status) => {
      if (status?.didJustFinish) {
        restore();
        sub?.remove?.();
      }
    });
    player.play();
    setTimeout(() => {
      restore();
      sub?.remove?.();
    }, 3000);
  } catch {
    // priming is best-effort
  }
};

// Preloads the three timer beeps and replays them with near-zero latency.
// Same API as the pre-2.0 hook: playSound('ready' | 'start' | 'end').
//
// Android drops the *first* audible playback of a sound while it is still
// decoding / acquiring audio focus. So every player is primed silently on mount
// and again when a workout is started (`warmup()`), well before the first
// audible cue is due.
export const useSounds = () => {
  const playersRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const players = {};

    (async () => {
      try {
        // 'mixWithOthers' → on Android no audio focus is requested, which
        // removes the focus-acquisition delay that was swallowing the first
        // beep. Also lets cues play over the user's music.
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'mixWithOthers',
          shouldPlayInBackground: false,
        });
      } catch {
        // non-fatal
      }
      if (cancelled) return;

      for (const [key, source] of Object.entries(SOURCES)) {
        try {
          const player = createAudioPlayer(source);
          players[key] = player;
          primePlayer(player);
        } catch (e) {
          console.warn(`useSounds: failed to load ${key}`, e);
        }
      }
      if (!cancelled) playersRef.current = players;
    })();

    return () => {
      cancelled = true;
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

  const warmup = useCallback(() => {
    const players = playersRef.current;
    if (!players) return;
    Object.values(players).forEach(primePlayer);
  }, []);

  const playSound = useCallback((type) => {
    const player = playersRef.current?.[type];
    if (!player) return;
    // Force audible — a priming pass may have left volume at 0.
    try {
      player.muted = false;
      player.volume = 1;
    } catch {
      // ignore
    }
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
  }, []);

  return { playSound, warmup };
};
