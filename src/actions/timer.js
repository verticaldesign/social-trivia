import * as types from './actionTypes';
import { database } from '../data/firebase'

const timer = database.ref('timer/')

export function createTimer() {
    return dispatch => {
        return timer.set({ 
            isTimerRunning: false, 
            currentTime: 60, 
            defaultTime: 60 
        })
        .then(() => {
            dispatch({
                type: types.CREATE_TIMER,
                isTimerRunning: false
            })
        })
    };
}

export function updateTimer(setTime) {
    return dispatch => {
        return timer.update({ 
            isTimerRunning: false, 
            currentTime: setTime, 
            defaultTime: setTime 
        })
        .then(() => {
            dispatch({
                type: types.UPDATE_TIMER,
                setTime
            })
        })
    };
} 

export function controlTimer(isTimerRunning) {
    return dispatch => {
        return timer.update({ isTimerRunning })
        .then(() => {
            dispatch({
                type: types.CONTROL_TIMER,
                isTimerRunning
            })
        })
    };
}

export function resetTimer(defaultTime) {
    return dispatch => {
        return timer.update({ 
            isTimerRunning: false, 
            currentTime: defaultTime 
        })
        .then(() => {
            dispatch({
                type: types.RESET_TIMER,
                currentTime: defaultTime
            })
        })
    };
} 

export function decrementTimer(timeLeft) {
    return dispatch => {
        return timer.update({ currentTime: timeLeft - 1 })
        .then(() => {
            dispatch({
                type: types.DECREMENT_TIMER,
                timeLeft
            })
        })
    };
} 

export function fetchTimer() {
    return dispatch => {
        timer.on('value', snapshot => {
            dispatch({
                type: types.FETCH_TIMER,
                timer: snapshot.val()
            })
        });
    }
}