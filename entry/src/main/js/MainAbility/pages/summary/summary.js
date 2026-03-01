import Router from '@system.router'
import { getMuscles } from '../../common/models/movement-data';

export default {
    data: {
        workoutData: '',
        elapsedTime: '00:00:00',
        totalSets: 0,
        volumeDisplay: '',
        muscles: [],
        effortLabel: '',
        effortColor: '#888888'
    },

    onInit(){
        if (this.workoutData) {
            let workout = JSON.parse(this.workoutData);
            let muscleCount = {};
            let sets = 0;
            let volume = 0;

            workout.movements.forEach(function(m){
                let completed = m.completedSets || 0;
                sets += completed;

                // Volume calculation for completed sets
                (m.setRecords || []).forEach(function(s, i){
                    if(i < completed){
                        if(s.kg > 0 && s.reps > 0) {
                            volume += s.kg * s.reps;
                        }
                    }
                });

                // Weight muscle count by completed sets only
                if(completed > 0){
                    let targets = getMuscles(m.name);
                    targets.forEach(function(m){
                        muscleCount[m] = (muscleCount[m] || 0) + completed;
                    });
                }
            });

            this.totalSets = sets;
            this.volumeDisplay = volume >= 10000 ? `${(volume / 1000).toFixed(1)} t` : `${volume} kg`;

            // Calculate percentages and sort
            let keys = Object.keys(muscleCount);
            let total = keys.reduce(function(sum, k){ return sum + muscleCount[k];}, 0);

            let muscleList = keys.map(function(k){
                let pct = Math.round((muscleCount[k] / total) * 100);
                return {
                    name: k,
                    percent: pct,
                    barWidth: `${Math.max(pct, 8)}%`,
                    label: `${pct}%`
                };
            }).sort(function(a,b){
                return b.percent - a.percent;
            });

            this.muscles = muscleList;

            // Effort classification
            const parts = this.elapsedTime.split(':');
            let min = (parseInt(parts[0]) * 60) + parseInt(parts[1]) + (parseInt(parts[2]) / 60);
            console.info(`${min}`);
            this.calcEffort(volume, min, sets);
        }
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

    goHome(){
        Router.replace({uri: 'pages/index/index' });
    }
};