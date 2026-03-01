import Router from '@system.router';
import { createSetRecord } from '../../common/models/workout-data';
import { heartRateService } from '../../common/services/heart-rate-service';
import { VibratorUtil } from '../../common/utils/vibrator';

export default {
    data: {
        movementData: '',
        workoutData: '',
        movementIndex: 0,
        movementName: '',
        startTime: 0,
        totalSets: 3,
        currentSet: 1,
        originalCompletedSets: 0,
        kg: 0,
        reps: 10,
        setRecords: [],
        heartRate: '--',
        kgRange: [],
        repsRange: [],
        kgIndex: 0,
        repsIndex: 9,
        showPopup: false,
        popupShown: false
    },

    onInit() {
        // Generate kg range: 0-200, 2.5kg increases
        for (let i = 0; i <= 200; i+= 2.5) {
            this.kgRange.push(String(i));
        }
        // Generate reps range: 1-50
        for (let j = 1; j <= 50; j++) {
            this.repsRange.push(String(j));
        }

        let self = this;
        heartRateService.subscribe(function(hr){
            self.heartRate = hr;
            if (!self.popupShown && self.heartRate > 150) {
                self.showPopup = true;
                self.popupShown = true;
            }
        });

        if (this.movementData) {
            let m = JSON.parse(this.movementData);
            this.movementName = m.name;
            this.totalSets = m.sets;
            this.setRecords = m.setRecords;
            this.originalCompletedSets = m.completedSets || 0;

            // Load first set values
            this.loadCurrentSet();
        }
    },

    loadCurrentSet() {
        let record = this.setRecords[this.currentSet - 1];
        this.kg = record.kg;
        this.reps = record.reps;
        this.kgIndex = Math.round(this.kg / 2.5);
        this.repsIndex = this.reps - 1;
    },

    saveCurrentSet() {
        this.setRecords[this.currentSet - 1].kg = this.kg;
        this.setRecords[this.currentSet - 1].reps = this.reps;
    },

    onKgChange(e){
        this.kgIndex = e.newSelected;
        this.kg = this.kgIndex * 2.5;
        this.saveCurrentSet();
    },

    onRepsChange(e){
        this.repsIndex = e.newSelected;
        this.reps = this.repsIndex + 1;
        this.saveCurrentSet();
    },

    increaseKg() {
        this.kg += 2.5;
        this.saveCurrentSet();
    },

    decreaseKg() {
        if (this.kg >= 2.5) {
            this.kg -= 2.5;
            this.saveCurrentSet();
        }
    },

    increaseReps() {
        if (this.showPopup) {
            return;
        }
        this.reps++;
        this.saveCurrentSet();
    },

    decreaseReps() {
        if (this.showPopup) {
            return;
        }
        if (this.reps > 1) {
            this.reps--;
            this.saveCurrentSet();
        }
    },

    prevSet() {
        if (this.showPopup) {
            return;
        }
        if (this.currentSet > 1) {
            this.saveCurrentSet();
            this.currentSet--;
            this.loadCurrentSet();
        }
    },

    nextSet() {
        if (this.showPopup) {
            return;
        }
        if (this.currentSet < this.totalSets) {
            this.saveCurrentSet();
            this.currentSet++;
            this.loadCurrentSet();
        }
    },

    markDone(){
        if (this.showPopup) {
            return;
        }
        VibratorUtil.vibrateShort();
        this.saveCurrentSet();
        Router.replace({
            uri: 'pages/workout/workout',
            params: {
                workoutData: this.buildUpdatedWorkoutData(this.currentSet),
                startTime: this.startTime
            }
        });
    },

    allSetsComplete() {
        for (let i = 0; i < this.setRecords.length; i++) {
            if (!this.setRecords[i].done) {
                return false;
            }
        }
        return true;
    },

    addSet() {
        if (this.showPopup) {
            return;
        }
        VibratorUtil.vibrateShort();
        let lastRecord = this.setRecords[this.currentSet - 1];
        this.setRecords.push(createSetRecord(lastRecord.kg, lastRecord.reps));
        this.totalSets++;
        this.saveCurrentSet();
        this.currentSet = this.totalSets;
        this.loadCurrentSet();
    },

    buildUpdatedWorkoutData(completedSets){
        let workout = JSON.parse(this.workoutData);
        workout.movements[this.movementIndex].sets = this.totalSets;
        workout.movements[this.movementIndex].completedSets = completedSets;
        workout.movements[this.movementIndex].setRecords = this.setRecords;
        return JSON.stringify(workout);
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            Router.replace({
                uri: 'pages/workout/workout',
                params: {
                    workoutData: this.buildUpdatedWorkoutData(this.originalCompletedSets),
                    startTime: this.startTime
                }
            });
        }
    },
    closePopup(){
        this.showPopup = false;
    }
};