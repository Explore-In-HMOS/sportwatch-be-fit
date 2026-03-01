import storage from '@system.storage'
import { getWorkout } from '../models/workout-data'
import { getAllMovements } from '../models/movement-data'
import { fileManager } from './file-manager'

const STORAGE_PREFIX = 'be_fit_';

export function loadWorkout(callback, routineName, routineData) {
    let workout = getWorkout(routineName, routineData);
    callback(workout);
}

export function loadAllMovements(callback) {
    let movements = getAllMovements();
    callback(movements);
}

export function saveRoutine(routine, routineName) {
    getNextRoutineId((routineId) => {

        storage.set({
            key: `${STORAGE_PREFIX}routineID_${routineId}`,
            value: routineName
        });

        fileManager.write(
            `${STORAGE_PREFIX}routine_${routineId}.json`,
            routine
        );
    });
}

export function getRoutineById(routineId, callback) {
    const fileName = `${STORAGE_PREFIX}routine_${routineId}.json`;

    fileManager.read(
        fileName,
        '[]', // default if file missing
        (data) => {
            try {
                const routine = JSON.parse(data);
                callback(routine);
            } catch (e) {
                callback(null);
            }
        }
    );
}

export function getAllRoutineNames(callback) {
    fileManager.read(
        'routine_count.txt',
        '0',
        (data) => {
            console.info(`RAW routine_count.txt = "${data}"`);

            const routineCount = parseInt(data, 10) || 0;

            if (routineCount <= 0) {
                callback([]);
                return;
            }

            let routineNames = [];
            let remaining = routineCount;

            for (let routineID = 0; routineID < routineCount; routineID++) {
                storage.get({
                    key: `${STORAGE_PREFIX}routineID_${routineID}`,
                    success: (routineName) => {
                        console.info(`Routine name: ${routineName}`)
                        routineNames.push({
                            id: routineID,
                            name: String(routineName)
                        });

                        if (--remaining === 0) {
                            routineNames.sort((a, b) => a.id - b.id);
                            callback(routineNames);
                        }
                    },
                    fail: () => {
                        console.error(`Missing routineID_${routineID}`);

                        if (--remaining === 0) {
                            routineNames.sort((a, b) => a.id - b.id);
                            callback(routineNames);
                        }
                    }
                });
            }
        }
    );
}

function getNextRoutineId(callback) {
    fileManager.read(
        'routine_count.txt',
        '0',
        (data) => {
            let current = parseInt(data, 10) || 0;
            let next = current + 1;

            fileManager.write(
                'routine_count.txt',
                String(next),
                () => callback(current)
            );
        }
    );
}