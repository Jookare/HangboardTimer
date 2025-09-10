import { useAudioPlayer  } from 'expo-audio';

const soundFiles = {
    ready: require('../../../../assets/ready-beep.mp3'),
    start: require('../../../../assets/start-beep.mp3'),
    end: require('../../../../assets/end-beep.mp3'),
};


export const useSounds = () => {
    const player = useAudioPlayer(soundFiles['ready']);

    function playSound(type) {
        let sound = soundFiles[type];
        player.replace(sound)
        player.play();
    };

    return { playSound };
};

