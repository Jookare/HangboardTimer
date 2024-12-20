import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';

const soundFiles = {
    ready: require('../../../../assets/ready-beep.mp3'),
    start: require('../../../../assets/start-beep.mp3'),
    end: require('../../../../assets/end-beep.mp3'),
};



export const useSounds = () => {

    function playSound(type) {
        let sound = soundFiles[type];
        console.log(`Playing sound: ${type}`);
        Audio.Sound.createAsync(
            sound,
            { shouldPlay: true }
        ).then((res) => {
            res.sound.setOnPlaybackStatusUpdate((status) => {
                if (!status.didJustFinish) return;
                console.log('Unloading ' + type);
                res.sound.unloadAsync().catch(() => { });
            });
        }).catch((error) => { });

    };

    return { playSound };
};

