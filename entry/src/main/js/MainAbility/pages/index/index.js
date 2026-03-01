import { getAllRoutineNames, getRoutineById, loadWorkout } from '../../common/storage/workout-storage';
import Router from '@system.router';
import { deleteHistoryEntry, getHistory } from '../../common/storage/history-storage';
import { parseHistoryMovement } from '../../common/models/history-data';

export default {
    data: {
        index: 1,
        pageNums: ['1', '2', '3'],
        dotIndex: 0,
        routineNames: [],
        history: [],
        hasHistory: false
    },

    onInit() {
        if (this.index === undefined || this.index === null) {
            this.index = 0;
        }
        this.dotIndex = this.index;

        setTimeout(()=> getAllRoutineNames((names) => {
            this.routineNames = names;
        }), 100);

        this.loadHistory();
    },

    change(e) {
        this.dotIndex = e.index;
    },

    loadHistory(){
        const self = this;
        getHistory(function(entries){
            if (entries && entries.length > 0) {
                self.hasHistory = true;
                self.history = entries.map(function(e){
                    const movements = (e.m || []).map(parseHistoryMovement);
                    let totalSets = 0;
                    movements.forEach(function(m){
                        totalSets += m.completedSets || 0;
                    });
                    let dateStr = '';
                    if(e.t){
                        const d = new Date(e.t * 1000);
                        const pad = function(n){ return n < 10 ? `0${n}` : `${n}`;};
                        dateStr = `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
                    }
                    return {
                        workoutName: e.n || 'Workout',
                        dateDisplay: dateStr,
                        durationMin: e.d || 0,
                        movementCount: movements.length,
                        totalSets: totalSets,
                        movements: movements,
                        raw: e
                    };
                });
            } else {
                self.hasHistory = false;
                self.history = [];
            }
        });
    },

    openHistory(index) {
        const entry = this.history[index];
        if (!entry || !entry.raw) {
            return;
        }
        Router.replace({
            uri: 'pages/history-detail/history-detail',
            params: {
                historyData: JSON.stringify(entry.raw)
            }
        });
    },

    deleteHistory(index) {
        const self = this;
        deleteHistoryEntry(index, function(){
            self.loadHistory();
        }, function(data, code){
            console.error(`Failed to delete history, code: ${code}`);
        });
    },

    startWorkout(routineId, routineName) {
        getRoutineById(routineId, (data) => {
            console.info(`workout data: ${JSON.stringify(data)}`)
            loadWorkout(function (workout) {
                Router.replace({
                    uri: 'pages/workout/workout',
                    params: {
                        workoutData: JSON.stringify(workout)
                    }
                });
            }, routineName, data);
        });
    },

    createRoutine(){
        Router.replace({
            uri: 'pages/custom-routine/custom-routine'
        });
    },

    openGymAccount() {
        Router.replace({
            uri: 'pages/gym-account/gym-account'
        });
    },

    openGymSubscription() {
        Router.replace({
            uri: 'pages/gym-subscription/gym-subscription'
        });
    },

    openGymQr() {
        Router.replace({
            uri: 'pages/gym-qr/gym-qr'
        });
    },

    openGymNearby() {
        Router.replace({
            uri: 'pages/gym-nearby/gym-nearby'
        });
    },

    formatDuration(min) {
        if (min === undefined || min === null) {
            return '--';
        }
        const rounded = Math.max(1, Math.round(min));
        return `${rounded} min`;
    }
};