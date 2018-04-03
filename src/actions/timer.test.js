import 'isomorphic-fetch';
import { expect } from 'code';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './timer';
import * as types from './actionTypes';

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

let store;

beforeEach(() => {
    store = mockStore({})
})

afterEach(() => {
    store.clearActions()
})

it('creates an async action to create the timer', () => {

    const expectedAction = { type: types.CREATE_TIMER, isTimerRunning: false };

    return store.dispatch(actions.createTimer())
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to control the timer', () => {

    const mockIsTimerRunning = true;

    const expectedAction = { type: types.CONTROL_TIMER, isTimerRunning: mockIsTimerRunning };

    return store.dispatch(actions.controlTimer(mockIsTimerRunning))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to reset the timer', () => {

    const mockDefaultTime = 10;

    const expectedAction = { type: types.RESET_TIMER, currentTime: mockDefaultTime };

    return store.dispatch(actions.resetTimer(mockDefaultTime))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })

});

it('creates an async action to update the timer', () => {

    const mockSetTime = 10;

    const expectedAction = { type: types.UPDATE_TIMER, setTime: mockSetTime };

    return store.dispatch(actions.updateTimer(mockSetTime))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })  
        
});

it('creates an async action to decrement the timer', () => {

    const mockTimeLeft = 10;

    const expectedAction = { type: types.DECREMENT_TIMER, timeLeft: mockTimeLeft };

    return store.dispatch(actions.decrementTimer(mockTimeLeft))
        .then(() => {
            const storeActions = store.getActions();
            expect(storeActions[0]).to.equal(expectedAction);
        })   
        
});