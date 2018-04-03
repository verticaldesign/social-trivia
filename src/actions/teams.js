import * as types from './actionTypes';
import { database } from '../data/firebase'

const teams = database.ref('teams/')
const isShowingAnswersInDB = database.ref('isShowingAnswers')

export function createTeam(id, createdAt) {
    return dispatch => {
        return teams.child(id).set({ 
            answer: 0, 
            answeredAt: 0, 
            score: 0, 
            createdAt, 
            isSubmitted: false 
        })
        .then(() => {
            dispatch({
                type: types.CREATE_TEAM,
                id,
                createdAt
            })
        })
    };
}

export function fetchTeams(teams) {
    return {
        type: types.FETCH_TEAMS,
        teams
    };
}

export function fetchTeamsFromDB() {
    return dispatch => {
        teams.on('value', snapshot => {
            dispatch(fetchTeams(snapshot.val()))
        });
    };
}

export function fetchIsShowingAnswers() {
    return dispatch => {
        isShowingAnswersInDB.on('value', snapshot => {
            dispatch({ 
                type: types.FETCH_IS_SHOWING_ANSWERS, 
                isShowingAnswers: snapshot.val() 
            })
        })
    };
}

export function submitAnswer(answer, id, answeredAt, isSubmitted) {
    return dispatch => {
        return teams.child(id).update({ 
            answer, 
            id, 
            answeredAt, 
            isSubmitted 
        })
        .then(() => {
            dispatch({
                type: types.SUBMIT_ANSWER,
                answer,
                id,
                answeredAt,
                isSubmitted
            })
        })
    };
}

export function updateTeam(newScore, id) {
    return dispatch => {
        return teams.child(id).update({ 
            answer: 0, 
            answeredAt: 0, 
            score: newScore,
            isSubmitted: false
        })
        .then(() => {
            dispatch({
                type: types.UPDATE_TEAM,
                newScore,
                id
            })
        })
    };
}

export function toggleShowAnswers(isShowingAnswers) {
    return dispatch => {
        return isShowingAnswersInDB.set(!isShowingAnswers)
        .then(() => {
            dispatch({
                type: types.TOGGLE_SHOW_ANSWERS,
                isShowingAnswers
            })
        })
    };
}

export function deleteTeam(id) {
    return dispatch => {
        return teams.child(id).remove()
        .then(() => {
            dispatch({
                type: types.DELETE_TEAM,    
                id
            })
        })
    };
}