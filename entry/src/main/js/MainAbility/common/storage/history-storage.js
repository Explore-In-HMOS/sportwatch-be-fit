import { fileManager } from './file-manager';
import { createHistoryEntry, createHistoryMovement } from '../models/history-data';

const HISTORY_FILE = 'workout_history.json';
const MAX_BYTES = 3400;

export function getHistory(callback) {
    fileManager.read(HISTORY_FILE, '[]', function(data){
        try {
            const history = JSON.parse(data);
            callback(history);
        } catch (e) {
            console.error(`[HistoryStorage] Failed to parse history: ${e}`);
            callback([]);
        }
    });
}

export function saveHistoryEntry(entry, onSuccess, onFail) {
    getHistory(function(history){
        history.unshift(entry);
        let json = JSON.stringify(history);
        while (json.length > MAX_BYTES && history.length > 1){
            history.pop();
            json = JSON.stringify(history);
            console.info(`[HistoryStorage] Trimmed oldest entry, now: ${json.length} bytes`);
        }
        fileManager.write(HISTORY_FILE, json, onSuccess, onFail);
    });
}

export function clearHistory(onSuccess, onFail) {
    fileManager.delete(HISTORY_FILE, onSuccess, onFail);
}

export function deleteHistoryEntry(index, onSuccess, onFail) {
    getHistory(function(history){
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            fileManager.write(HISTORY_FILE, JSON.stringify(history), onSuccess, onFail);
        } else {
            if(onFail){
                onFail('Invalid Index', -1);
            }
        }
    });
}

export function buildAndSaveHistory(workout, elapsedTime, onSuccess, onFail){
    const timeParts = elapsedTime.split(':');
    const durationMin = Math.round(
        (parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2])) / 60
    );

    let totalVolume = 0;
    const historyMovements = [];
    workout.movements.forEach(function(m){
        const completed = m.completedSets || 0;
        const firstSet = (m.setRecords || [])[0] || {reps: 0, kg: 0};
        (m.setRecords || []).forEach(function(s,i){
            if(i < completed){
                totalVolume += s.kg * s.reps;
            }
        });
        if(completed > 0){
            historyMovements.push(createHistoryMovement(m.name, firstSet.reps, firstSet.kg, completed, m.sets));
        }
    });

    const entry = createHistoryEntry(
        workout.name,
        Math.floor(Date.now() / 1000),
        durationMin,
        totalVolume,
        historyMovements
    );

    saveHistoryEntry(entry, onSuccess, onFail);
}