import { expect } from 'code'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import React from 'react'
import { Teams } from './teams'

const numberOfTeams = 6

describe('Given `Teams`' ,() => {

    let component,
        sandbox,
        fetchTeamsFromDBSpy,
        fetchIsShowingAnswersSpy,
        fetchCurrentQuestionFromDBSpy,
        updateTeamSpy

    const mockTeamsProp = {
        'admin': { answer: 1, score: 0 },
        'team-1': {  answer: 1, score: 0 },
        'team-2': {  answer: 1, score: 0 }  
    }   
    
    const teamsInState = [
        { id: 'team-1', answer: 1, score: 0 },
        { id: 'team-2', answer: 1, score: 0 }        
    ]
    
    function requiredProps(overrides= {}) {
        return {
            fetchTeamsFromDB: fetchTeamsFromDBSpy,
            fetchIsShowingAnswers: fetchIsShowingAnswersSpy,
            fetchCurrentQuestionFromDB: fetchCurrentQuestionFromDBSpy,
            updateTeam: updateTeamSpy,
            isShowingAnswers: false,
            teams: mockTeamsProp,
            ...overrides
        }
    }

    function renderComponent(props=requiredProps()) {
        const newProps = requiredProps(props)
        return shallow(<Teams {...newProps}/>)

    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        fetchTeamsFromDBSpy = sandbox.spy()
        fetchIsShowingAnswersSpy = sandbox.spy()
        fetchCurrentQuestionFromDBSpy = sandbox.spy()
        updateTeamSpy = sandbox.spy()
        component = renderComponent()
        component.setState({ teams: teamsInState })
    })
    
    afterEach(() => {
    
        sandbox.restore()
    })

    it('it should exist as a `section` tag', () => {
        
        expect(component.type()).to.equal('section')

    })

    describe('When mounted', () => {

        it('should dispatch fetchTeamsFromDB() and fetchIsShowingAnswers()', () => {

            sinon.assert.calledOnce(fetchTeamsFromDBSpy)

            sinon.assert.calledOnce(fetchIsShowingAnswersSpy)

            sinon.assert.calledOnce(fetchCurrentQuestionFromDBSpy)
            
        })
    })

    it('should contain a `Connect(Timer)` component', () => {

        expect(component.find('Connect(Timer)').exists()).to.be.true()

    })

    describe('Given `isShowingAnswers` is true', () => {

        describe('Given `correctAnswer` exists', () => {

            it('should render a `span` with a specific class name that contains the correct answer', () => {

                component = renderComponent({ isShowingAnswers: true, correctAnswer: 1 })

                expect(component.find('.correct-answer').text()).to.equal('Correct Answer: 1')

            })

        })

    })

    it('shoud contain a `ul` with a proper class name', () => {

        expect(component.find('.team-list').type()).to.equal('ul')

    })

    describe('Given `ul`', () => {

        it('should render a `li` with a proper class name for every team in state', () => {

            expect(component.find('.team-list-item').length).to.equal(component.state().teams.length)

        })

        describe('Given `li`', () => {

            describe('And the `parentId` is `admin`', () => {

                it('should have a key set to each team id', () => {
    
                    const teamListItem = component.find('.team-list-item')
    
                    expect(teamListItem.first().key()).to.equal(component.state().teams[0].id)
    
                })
    
                it('should contain s `span` elements with proper class names', () => {            
                    
                    const teamListItem = component.find('.team-list-item')   
    
                    expect(teamListItem.first().find('span').length).to.equal(2)
    
                })
    
                it('should render a `span` with a team answer for every team', () => {
    
                    expect(component.find('.team-answer').length).to.equal(component.state().teams.length)
    
                })

                it('should contain a `span` to show each team score', () => {

                    expect(component.find('.team-score').length).to.equal(component.state().teams.length)

                    describe('Given `.team-score`', () => {

                        it('should contain a `decrement-team-score-button` and a `increment-team-score-button`', () => {

                            expect(component.find('decrement-team-score-button').length).to.equal(component.state().teams.length)

                            expect(component.find('increment-team-score-button').length).to.equal(component.state().teams.length)                            

                        })

                    })

                })

            })

        })

    })
})