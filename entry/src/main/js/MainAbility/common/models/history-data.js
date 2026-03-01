/**
 * Compact format: 'Bench Press|6|80|2/3'
 * name|reps|kg|completedSets/TotalSets
 */
export function createHistoryMovement(name, reps, kg, completedSets, totalSets) {
    return `${name}|${reps}|${kg}|${completedSets}/${totalSets}`;
}

/** Parse 'Bench Press|6|80|2/3' back to object */
export function parseHistoryMovement(str) {
    const parts = str.split('|');
    const setsParts = (parts[3] || '0/0').split('/');
    return {
        name: parts[0] || '',
        reps: parseInt(parts[1]) || 0,
        kg: parseInt(parts[2]) || 0,
        completedSets: parseInt(setsParts[0]) || 0,
        sets: parseInt(setsParts[1]) || 0
    }
}

/** Compact entry: {n, t, d, v, m } */
export function createHistoryEntry(workoutName, timestamp, durationMin, volume, movements) {
    return {
        n: workoutName,
        t: timestamp,
        d: durationMin,
        v: volume || 0,
        m: movements
    };
}
