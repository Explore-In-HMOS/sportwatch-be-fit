import Router from '@system.router';
import { saveRoutine } from '../../common/storage/workout-storage';
import { VibratorUtil } from '../../common/utils/vibrator';

export default {
    data: {
        inputText: '',
        selectedMovements: '',
        showCursor: false,
        showKeyboard: false,
        isShiftActive: false,
        currentRows: [],
        symRows: [
            {
                keys: [
                    { label: '!', value: '!' },
                    { label: '@', value: '@' },
                    { label: '#', value: '#' },
                    { label: '$', value: '$' },
                    { label: '%', value: '%' },
                    { label: '&', value: '&' },
                    { label: '*', value: '*' }
                ]
            },
            {
                keys: [
                    { label: '(', value: '(' },
                    { label: ')', value: ')' },
                    { label: '-', value: '-' },
                    { label: '+', value: '+' },
                    { label: '=', value: '=' },
                    { label: '/', value: '/' },
                    { label: '?', value: '?' }
                ]
            },
            {
                keys: [
                    { label: '.', value: '.' },
                    { label: '[', value: '[' },
                    { label: ']', value: ']' },
                    { label: ',', value: ',' },
                    { label: ';', value: ';' },
                    { label: '|', value: '|' },
                    { label: '~', value: '~' }
                ]
            }
        ],
        numRows: [
            {
                keys: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '5', value: '5' }
                ]
            },
            {
                keys: [
                    { label: '6', value: '6' },
                    { label: '7', value: '7' },
                    { label: '8', value: '8' },
                    { label: '9', value: '9' },
                    { label: '0', value: '0' }
                ]
            }
        ],
        letterRows: [
            {
                keys: [
                    { label: 'Q', value: 'q', type: '' },
                    { label: 'W', value: 'w', type: '' },
                    { label: 'E', value: 'e', type: '' },
                    { label: 'R', value: 'r', type: '' },
                    { label: 'T', value: 't', type: '' },
                    { label: 'Y', value: 'y', type: '' },
                    { label: 'U', value: 'u', type: '' }
                ]
            },
            {
                keys: [
                    { label: 'A', value: 'a', type: '' },
                    { label: 'S', value: 's', type: '' },
                    { label: 'D', value: 'd', type: '' },
                    { label: 'F', value: 'f', type: '' },
                    { label: 'G', value: 'g', type: '' },
                    { label: 'H', value: 'h', type: '' },
                    { label: 'J', value: 'j', type: '' }
                ]
            },
            {
                keys: [
                    { label: 'I', value: 'i', type: '' },
                    { label: 'O', value: 'o', type: '' },
                    { label: 'P', value: 'p', type: '' },
                    { label: 'K', value: 'k', type: '' },
                    { label: 'L', value: 'l', type: '' },
                    { label: 'N', value: 'n', type: '' },
                    { label: 'M', value: 'm', type: '' }
                ]
            },
            {
                keys: [
                    { label: 'â‡§', value: 'shift', type: 'special' },
                    { label: 'Z', value: 'z', type: '' },
                    { label: 'X', value: 'x', type: '' },
                    { label: 'C', value: 'c', type: '' },
                    { label: 'V', value: 'v', type: '' },
                    { label: 'B', value: 'b', type: '' },
                    { label: 'Del', value: 'del' },
                    { label: ' ', value: 'space' }
                ]
            }
        ]
    },

    onInit() {
        this.currentRows = this.letterRows;
        this.startCursorBlink();
    },

    handleKeyPress(key) {
        if (key.value === 'shift') {
            this.toggleShift();
            return;
        }

        if (key.value === 'space') {
            this.handleSpace()
            return;
        }

        if (key.value === 'del') {
            this.handleBackspace()
            return;
        }

        if (key.value === 'ok') {
            this.handleSubmit()
            return;
        }

        let char = key.value;

        if (this.isShiftActive) {
            char = char.toUpperCase();
            this.isShiftActive = false;
        }

        this.inputText += char;
    },

    handleSpace() {
        this.inputText += ' ';
    },

    handleBackspace() {
        if (this.inputText.length > 0) {
            this.inputText = this.inputText.slice(0, -1);
        }
    },

    handleSubmit() {
        this.closeKeyboard()
    },

    toggleShift() {
        this.isShiftActive = !this.isShiftActive;
        this.currentRows = this.letterRows.map(row => ({
            keys: row.keys.map(key => {
                if (key.value !== 'shift') {
                    return {
                        ...key,
                        label: this.isShiftActive ?
                            key.value.toUpperCase() :
                            key.value.toLowerCase()
                    };
                }
                return key;
            })
        }));
    },

    letterKeys() {
        this.currentRows = this.letterRows;
    },

    numKeys() {
        this.currentRows = this.numRows;
    },

    symKeys() {
        this.currentRows = this.symRows;
    },

    startCursorBlink() {
        setInterval(() => {
            this.showCursor = !this.showCursor;
        }, 500);
    },

    openKeyboard() {
        this.showKeyboard = true
    },

    closeKeyboard() {
        this.showKeyboard = false
    },

    onDestroy() {
        console.error('Keyboard destroyed');
    },

    cancel(){
        VibratorUtil.vibrateShort();
        Router.replace(
            {
                uri: 'pages/custom-routine/custom-routine',
                params: {
                    selectedMovements: this.selectedMovements
                }
            }
        );
    },
    saveRoutine(){
        VibratorUtil.vibrateLong();
        saveRoutine(this.selectedMovements, this.inputText);
        Router.replace(
            {
                uri: 'pages/index/index'
            }
        )
    }
};