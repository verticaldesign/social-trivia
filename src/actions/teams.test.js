import 'isomorphic-fetch';
import { expect } from 'code';
import sinon from 'sinon';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from './teams';
import * as types from './actionTypes';
import { database } from '../data/firebase'

const teams = database.ref('teams/')

let store;

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const mockId = 'team-1';
const mockAnswer = 10;
const mockTimeStamp = Date.now();
const mockScore = 10;
const mockIsSubmitted = false;
const mockTeam =  { [mockId]:  { answer: mockAnswer, id: mockId, answeredAt: mockTimeStamp, score: mockScore, isSubmitted: mockIsSubmitted  }  }

beforeEach(() => {
    store = mockStore({})
})

it('creates an async action to create a team', () => {

    const expectedAction = { type: types.CREATE_TEAM, id: mockId, createdAt: mockTimeStamp };

    return store.dispatch(actions.createTeam(mockId, mockTimeStamp))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to submit an answer', () => {

    const expectedAction = { type: types.SUBMIT_ANSWER, answer: mockAnswer, id: mockId, answeredAt: mockTimeStamp, isSubmitted: mockIsSubmitted };
    
    return store.dispatch(actions.submitAnswer(mockAnswer, mockId, mockTimeStamp, mockIsSubmitted))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to update the score for a team', () => {

    const expectedAction = { type: types.UPDATE_TEAM, newScore: mockScore, id: mockId };

    return store.dispatch(actions.updateTeam(mockScore, mockId))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to show all team answers', () => {

    const expectedAction = { type: types.TOGGLE_SHOW_ANSWERS, isShowingAnswers: true };

    return store.dispatch(actions.toggleShowAnswers(true))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to delete a team', () => {

    const expectedAction = { type: types.DELETE_TEAM, id: mockId };

    return store.dispatch(actions.deleteTeam(mockId))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an action to fetch the teams', () => {

    const expectedAction = { type: types.FETCH_TEAMS, teams: mockTeam };

    expect(actions.fetchTeams(mockTeam)).to.equal(expectedAction);

});