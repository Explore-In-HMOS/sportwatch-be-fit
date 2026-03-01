export function createSetRecord(kg, reps) {
    return { kg: kg, reps: reps, done: false };
}

export function createMovement(name, sets, kg, reps) {
    let setRecords = [];
    for (let i = 0; i < sets; i++) {
        setRecords.push(createSetRecord(kg, reps));
    }
    return {
        name: name,
        sets: sets,
        completedSets: 0,
        setRecords: setRecords
    };
}

export function createWorkout(name, movements) {
    return {
        name: name,
        movements: movements
    };
}

export function getSampleWorkout() {
    return createWorkout('Push Day', [
        createMovement('Bench Press', 2, 80, 6),
        createMovement('Incline Press', 2, 60, 8),
        createMovement('Shoulder Press', 2, 50, 8),
        createMovement('Weighted Dips', 3, 40, 6),
        createMovement('Rope PushDown', 4, 60, 10),
        createMovement('Diamond PushUps', 2, 0, 12)
    ]);
}

export function getWorkout(workoutName, movs) {
    let movements = []

    movs.forEach(mov => {
        movements.push(createMovement(mov.name, mov.setCount, 0, 0))
    });

    return createWorkout(workoutName, movements);
}