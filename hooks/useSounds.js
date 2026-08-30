import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

const SOURCES = {
  ready: require('@/assets/ready-beep.mp3'),
  start: require('@/assets/start-beep.mp3'),
  end: require('@/assets/end-beep.mp3'),
};

/**
 * Timer beeps.
 *
 * Android's ExoPlayer drops (or badly delays) the *first* playback of a clip
 * that has been idle, which is why the first hang-end / rest-end cue was silent
 * on Android while iOS was fine. So each cue is created and silently pre-rolled
 * a few seconds before it is due (`prewarm(type)`, called from the timer on
 * phase changes), then `playSound(type)` fires that already-warm player.
 */
export const useSounds = () => {
  const stashRef = useRef({});
  const liveRef = useRef(new Set());

  const dispose = useCallback((player) => {
    liveRef.current.delete(player);
    try {
      player.remove();
    } catch {
      // already released
    }
  }, []);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
    }).catch(() => {});

    const live = liveRef.current;
    const stash = stashRef.current;
    return () => {
      live.forEach((p) => {
        try {
          p.remove();
        } catch {
          // ignore
        }
      });
      live.clear();
      Object.keys(stash).forEach((k) => delete stash[k]);
    };
  }, []);

  // Create + silently exercise a player so the next real play is instant.
  const prewarm = useCallback(
    (type) => {
      const source = SOURCES[type];
      if (!source) return;

      const previous = stashRef.current[type];
      if (previous) dispose(previous);

      let player;
      try {
        player = createAudioPlayer(source);
      } catch {
        return;
      }
      liveRef.current.add(player);
      stashRef.current[type] = player;

      try {
        player.volume = 0;
        player.play();
        setTimeout(() => {
          try {
            player.pause();
            player.seekTo(0);
            player.volume = 1;
          } catch {
            // ignore
          }
        }, 350);
      } catch {
        // priming is best effort
      }
    },
    [dispose],
  );

  const playSound = useCallback(
    (type) => {
      const source = SOURCES[type];
      if (!source) return;

      let player = stashRef.current[type];
      if (player) {
        stashRef.current[type] = null;
      } else {
        try {
          player = createAudioPlayer(source);
          liveRef.current.add(player);
        } catch (e) {
          console.warn(`useSounds: failed to create ${type}`, e);
          return;
        }
      }

      try {
        player.muted = false;
        player.volume = 1;
        player.seekTo(0);
      } catch {
        // ignore
      }
      try {
        const sub = player.addListener?.('playbackStatusUpdate', (status) => {
          if (status?.didJustFinish) {
            sub?.remove?.();
            dispose(player);
          }
        });
        player.play();
        setTimeout(() => dispose(player), 4000);
      } catch (e) {
        console.warn(`useSounds: failed to play ${type}`, e);
        dispose(player);
      }
    },
    [dispose],
  );

  return { playSound, prewarm };
};
