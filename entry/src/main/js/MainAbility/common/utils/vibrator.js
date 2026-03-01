import vibrator from '@system.vibrator';

function vibrateLong() {
    try {
        vibrator.vibrate({ mode: 'long' });
    } catch (e) {
        console.error('Vibrate long failed');
    }
}

function vibrateShort() {
    try {
        vibrator.vibrate({ mode: 'short' });
    } catch (e) {
        console.error('Vibrate short failed');
    }
}

export const VibratorUtil = {
    vibrateLong: vibrateLong,
    vibrateShort: vibrateShort
};