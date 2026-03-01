export const Muscle = Object.freeze({
    Chest: 'Chest',
    UpperChest: 'Upper Chest',
    Triceps: 'Triceps',
    FrontDeltoids: 'Front Deltoids',
    RearDeltoids: 'Rear Deltoids',
    Shoulders: 'Shoulders',
    Quadriceps: 'Quadriceps',
    Glutes: 'Glutes',
    Hamstrings: 'Hamstrings',
    Core: 'Core',
    LowerBack: 'Lower Back',
    Traps: 'Traps',
    Forearms: 'Forearms',
    Lats: 'Lats',
    Biceps: 'Biceps',
    Rhomboids: 'Rhomboids'
});

const movementData = {
    'Bench Press': [Muscle.Chest, Muscle.Triceps, Muscle.FrontDeltoids],
    'Incline Press': [Muscle.Chest, Muscle.FrontDeltoids],
    'Shoulder Press': [Muscle.FrontDeltoids],
    'Dips': [Muscle.Chest, Muscle.Triceps],
    'Weighted Dips': [Muscle.Chest, Muscle.Triceps],
    'Rope PushDown': [Muscle.Triceps],
    'Diamond PushUps': [Muscle.Triceps],
    'Squat': [Muscle.Quadriceps, Muscle.Glutes, Muscle.Hamstrings, Muscle.Core],
    'Deadlift': [Muscle.Hamstrings, Muscle.Glutes, Muscle.LowerBack, Muscle.Traps, Muscle.Forearms],
    'Pull Up': [Muscle.Lats, Muscle.Biceps, Muscle.RearDeltoids, Muscle.Core],
    'Overhead Press': [Muscle.Shoulders, Muscle.Triceps, Muscle.UpperChest],
    'Barbell Row': [Muscle.Lats, Muscle.Rhomboids, Muscle.Biceps, Muscle.RearDeltoids],
    'Lunges': [Muscle.Quadriceps, Muscle.Glutes, Muscle.Hamstrings],
    'Bicep Curl': [Muscle.Biceps, Muscle.Forearms],
    'Tricep Dips': [Muscle.Triceps, Muscle.Chest, Muscle.Shoulders],
    'Leg Press': [Muscle.Quadriceps, Muscle.Glutes, Muscle.Hamstrings]
};

/**
 * Get all available movements
 * @returns {string[]} Array of movement strings
 */
export function getAllMovements(){
    return Object.keys(movementData)
}

/**
 * Get target muscles of a movement
 * @param {string} name - Movement name
 * @returns {string[]} Array of muscle values
 */
export function getMuscles(name){
    return movementData[name] || [];
}