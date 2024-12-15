import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const soundFiles = [
    require('../../../../assets/ready-beep.mp3'),
    require('../../../../assets/start-beep.mp3'),
    require('../../../../assets/end-beep.mp3'),
];

export const useSounds = () => {
    const [sounds, setSounds] = useState([]);

    useEffect(() => {
        const loadSounds = async () => {
            const soundObjects = await Promise.all(
                soundFiles.map(async (file) => {
                    const { sound } = await Audio.Sound.createAsync(file);
                    return sound;
                })
            );
            setSounds(soundObjects);
        };

        loadSounds();

        return () => {
            sounds.forEach(async (sound) => {
                if (sound) await sound.unloadAsync();
            });
        };
    }, []);

    const playSound = (type) => {
        const soundIndex = { ready: 0, start: 1, end: 2 }[type];
        if (soundIndex !== undefined && sounds[soundIndex]) {
            sounds[soundIndex].replayAsync();
        }
    };

    return { playSound };
};
