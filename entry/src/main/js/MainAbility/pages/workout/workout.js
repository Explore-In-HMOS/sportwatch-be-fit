import Router from '@system.router';
import { heartRateService } from '../../common/services/heart-rate-service';
import { VibratorUtil } from '../../common/utils/vibrator';
import { buildAndSaveHistory } from '../../common/storage/history-storage';

export default {
    data: {
        workoutData: '',
        workoutName: '',
        movements: [],
        elapsedTime: '00:00:00',
        startTime: 0,
        timerInterval: null,
        heartRate: '--',
        showPopup: false,
        popupShown: false
    },

    onInit() {
        this.startTime = this.startTime ? parseInt(this.startTime) : Date.now();
        this.startTimer();

        let self = this;

        heartRateService.subscribe(function(hr){
            self.heartRate = hr;
            if (!self.popupShown && parseInt(self.heartRate) > 150) {
                self.showPopup = true;
                self.popupShown = true;
            }
        });

        if (this.workoutData) {
            let workout = JSON.parse(this.workoutData);
            this.workoutName = workout.name;
            this.movements = workout.movements.map(function (m) {
                let firstSet = m.setRecords[0];
                return {
                    name: m.name,
                    repsDisplay: firstSet.kg > 0 ? `${firstSet.reps} x ${firstSet.kg}kg` : `${firstSet.reps} reps`,
                    sets: m.sets,
                    completedSets: m.completedSets,
                    setRecords: m.setRecords,
                    setDisplay: `${m.completedSets}/${m.sets}`,
                    isComplete: m.completedSets > 0 && m.completedSets >= m.sets
                };
            });
        }
    },

    openMovement(index) {
        if (this.showPopup) {
            return;
        }
        clearInterval(this.timerInterval);
        let m = this.movements[index];
        Router.replace({
            uri: 'pages/movement/movement',
            params: {
                movementData: JSON.stringify(m),
                movementIndex: index,
                workoutData: this.workoutData,
                startTime: this.startTime
            }
        });
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            clearInterval(this.timerInterval);
            heartRateService.stop();
            Router.replace({ uri: 'pages/index/index' });
        }
    },

    finishWorkout(){
        if (this.showPopup) {
            return;
        }
        VibratorUtil.vibrateLong();
        clearInterval(this.timerInterval);
        heartRateService.stop();

        try {
            let workout = this.workoutData ? JSON.parse(this.workoutData) : null;
            if(workout){
                buildAndSaveHistory(workout, this.elapsedTime, null, function(code){
                    console.error(`[Workout] Failed to save history, code: ${code}`);
                });
            }
        } catch (e) {
            console.error(`[Workout] Error building history entry, error: ${e}`);
        }

        Router.replace({
            uri: 'pages/summary/summary',
            params: {
                workoutData: this.workoutData,
                elapsedTime: this.elapsedTime
            }
        });
    },

    startTimer(){
        let self = this;
        this.timerInterval = setInterval(function(){
            let diff = Math.floor((Date.now() - self.startTime) / 1000);
            let hrs = Math.floor(diff / 3600);
            let min = Math.floor((diff % 3600) / 60);
            let secs = diff % 60;
            self.elapsedTime = `${self.pad(hrs)}:${self.pad(min)}:${self.pad(secs)}`;
        }, 1000);
    },

    pad(n){
        return n < 10 ? `0${n}` : `${n}`;
    },

    closePopup(){
        this.showPopup = false;
    }
};