/**
 * Heart Rate Service
 * Two modes: 'real' uses sensor, 'mock' simulates data.
 * Default mode is 'real'. Fallback to mock if sensor fails.
 */
import sensor from '@system.sensor';

const MODE_REAL = 'real';
const MODE_MOCK = 'mock';

const state = {
    mode: MODE_REAL,
    mockInterval: null,
    currentHr: 0,
    activeCallback: null,
    isRunning: false
};

/** Internal: Broadcast HR */
function notifyCallback(state, hr) {
    state.currentHr = hr;
    if (state.activeCallback) {
        state.activeCallback(hr);
    }
}

/**
 * Starts real heart rate monitoring using @system.sensor.
 * Falls back to mock mode if sensor is unavailable
 */
function startReal(state) {
    sensor.subscribeHeartRate({
        success: function(data) {
            console.info(`[HeartRate] Real: ${state.currentHr}`);
            notifyCallback(state, data.heartRate);
        },
        fail: function(data, code) {
            console.error(`[HeartRate] Sensor failed with code: ${code}, falling back to Mock`);
            state.mode = MODE_MOCK;
            startMock(state);
        }
    });
}

/** Stops the real heart rate sensor sub. */
function stopReal(){
    sensor.unsubscribeHeartRate();
}

/**
 * Starts mock heart rate simulation.
 * Generates random walk between 70-160 bpm.
 */
function mockTick(state) {
    const delta = (Math.random() - 0.45) * 6;
    const hr = Math.round(Math.min(160, Math.max(70, state.currentHr + delta)));
    notifyCallback(state, hr);
}

function startMock(state) {
    state.currentHr = 72;
    state.mockInterval = setInterval(mockTick, 1000, state);
}

/** Stops the mock heart rate simulation. */
function stopMock(state){
    if(state.mockInterval){
        clearInterval(state.mockInterval);
        state.mockInterval = null;
    }
}

/**
 * Subscribe to updates. Starts sensor if not running.
 * @param {function} callback - Called with heart rate on each update.
 */
function subscribe(state, callback) {
    state.activeCallback = callback;

    // Send current value asap
    if(state.currentHr > 0){
        callback(state.currentHr);
    }

    // Start sensor if not running
    if(!state.isRunning){
        state.isRunning = true;
        if(state.mode === MODE_REAL) {
            startReal(state);
        } else {
            startMock(state);
        }
    }
}

/**
 * Unsubscribe from updates. Sensor keeps running.
 */
function unsubscribe(state) {
    state.activeCallback = null;
}

/** Stops all heart rate monitoring. */
function stop(state) {
    if(state.mode === MODE_REAL) {
        stopReal();
    }
    stopMock(state);
    state.activeCallback = null;
    state.isRunning = false;
    state.currentHr = 0;
}

/**
 * Switch between 'real' and 'mock'. Call before subscribe()
 * @param {string} newMode - Use MODE_REAL or MODE_MOCK
 */
function setMode(state, newMode) {
    state.mode = newMode;
}

/** @returns {string} Current mode */
function getMode(state) {
    return state.mode;
}

/** @returns {number} Last recorded heart rate */
function getCurrent(state) {
    return state.currentHr;
}

/** @returns {boolean} Whether sensor is active */
function isActive(state) {
    return state.isRunning;
}

export const heartRateService = {
    state: state,
    subscribe: function(callback) {
        return subscribe(this.state, callback);
    },
    unsubscribe: function() {
        return unsubscribe(this.state);
    },
    stop: function() {
        return stop(this.state);
    },
    getCurrent: function() {
        return getCurrent(this.state);
    },
    setMode: function(newMode) {
        return setMode(this.state, newMode);
    },
    getMode: function() {
        return getMode(this.state);
    },
    isActive: function() {
        return isActive(this.state);
    },
    MODE_REAL: MODE_REAL,
    MODE_MOCK: MODE_MOCK
};
