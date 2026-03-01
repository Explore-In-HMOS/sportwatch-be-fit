import Router from '@system.router';
import { getMuscles } from '../../common/models/movement-data';
import { parseHistoryMovement } from '../../common/models/history-data';

export default {
    data: {
        historyData: '',
        workoutName: '',
        dateDisplay: '',
        elapsedTime: '00:00:00',
        totalSets: 0,
        volumeDisplay: '',
        effortLabel: '',
        effortColor: '#888888',
        muscles: [],
        movements: []
    },

    onInit() {
        if (!this.historyData) {
            return;
        }
        const h = JSON.parse(this.historyData);
        this.workoutName = h.n || 'Workout';

        // Date display
        if(h.t){
            const d = new Date(h.t * 1000);
            const pad = function(n) { return n < 10 ? `0${n}` : `${n}`; };
            this.dateDisplay = `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
        }

        // Duration display
        const dur = h.d || 0;
        const hrs = Math.floor(dur / 60);
        const min = dur % 60;
        const pad = function(n) { return n < 10 ? `0${n}` : `${n}`; };
        this.elapsedTime = `${pad(hrs)}:${pad(min)}:00`;

        // Parse movements
        const parsed = (h.m || []).map(parseHistoryMovement);
        const muscleCount = {};
        let sets = 0;
        const volume = h.v || 0;

        parsed.forEach(function(m){
            const completed = m.completedSets || 0;
            sets += completed;

            if(completed > 0){
                const targets = getMuscles(m.name);
                targets.forEach(function(muscle){
                    muscleCount[muscle] = (muscleCount[muscle] || 0) + completed;
                });
            }
        });

        this.totalSets = sets;
        this.volumeDisplay = volume >= 9000 ? `${(volume / 1000).toFixed(1)} t` : `${volume} kg`;

        // Effort classification
        this.calcEffort(volume, dur, sets);

        // Muscle breakdown
        const keys = Object.keys(muscleCount);
        const total = keys.reduce(function(sum,k){ return sum + muscleCount[k];}, 0);
        this.muscles = keys.map(function(k){
            const pct = Math.round((muscleCount[k] / total) * 100);
            return {
                name: k,
                percent: pct,
                barWidth: `${Math.max(pct, 8)}%`,
                label: `${pct}%`
            };
        }).sort(function(a,b){
            return b.percent = a.percent;
        });

        // Movement Display
        this.movements = parsed.map(function(m){
            const repsDisplay = m.kg > 0 ? `${m.reps} x ${m.kg} kg` : `${m.reps} reps`;
            return {
                name: m.name,
                repsDisplay: repsDisplay,
                setDisplay: `${m.completedSets}/${m.sets}`,
                isComplete: m.completedSets > 0 && m.completedSets >= m.sets
            };
        });
    },

    calcEffort(volume, durationMin, sets){
        let score = 0;

        if(durationMin >= 60) { score += 3; }
        else if(durationMin >= 40) { score += 2; }
        else if(durationMin >= 20) { score += 1; }

        if(volume >= 5000) { score += 3; }
        else if(volume >= 3000) { score += 2; }
        else if(volume >= 1500) { score += 1; }

        if(sets >= 20) { score += 3; }
        else if(sets >= 12) { score += 2; }
        else if(sets >= 6) { score += 1; }

        if(score >= 8){
            this.effortLabel = 'Maximum';
            this.effortColor = '#ff3333';
        } else if(score >=6){
            this.effortLabel = 'Hard';
            this.effortColor = '#ff8800';
        } else if(score >=4){
            this.effortLabel = 'Medium';
            this.effortColor = '#ffcc00';
        } else if(score >=2){
            this.effortLabel = 'Light';
            this.effortColor = '#64ff64';
        } else {
            this.effortLabel = 'Minimal';
            this.effortColor = '#888888';
        }
    },

    onSwipe(e) {
        if (e.direction === 'right') {
            Router.replace({ uri: 'pages/index/index', params: {index: 0} });
        }
    }
};