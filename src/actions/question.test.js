import 'isomorphic-fetch';
import { expect } from 'code';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './question';
import * as types from './actionTypes';

const currentQuestion = "How much?";
const emptyString = '';
const middlewares = [thunk]
const mockStore = configureStore(middlewares)

let store

beforeEach(() => {
    store = mockStore({})
})

afterEach(() => {
    store.clearActions()
})

it('creates an async action to update the currentQuestion', () => {

    const expectedAction = { type: types.UPDATE_CURRENT_QUESTION, currentQuestion };

    return store.dispatch(actions.updateCurrentQuestion(currentQuestion))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to update the currentQuestion to an empty string if nothing is passed to it', () => {

    const expectedAction = { type: types.UPDATE_CURRENT_QUESTION, currentQuestion: emptyString };

    return store.dispatch(actions.updateCurrentQuestion())
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});