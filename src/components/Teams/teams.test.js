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
        updateTeamSpy,
        updateTeamScoreSpy,
        submitTeamScoreToDBSpy,
        parentId

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
            updateTeamScore: updateTeamScoreSpy,
            submitTeamScoreToDB: submitTeamScoreToDBSpy,
            isShowingAnswers: false,
            teams: mockTeamsProp,
            parentId: 'admin',
            ...overrides
        }
    }

    function renderComponent(props=requiredProps()) {
        const newProps = requiredProps(props)
        return shallow(<Teams {...newProps }/>)

    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        fetchTeamsFromDBSpy = sandbox.spy()
        fetchIsShowingAnswersSpy = sandbox.spy()
        fetchCurrentQuestionFromDBSpy = sandbox.spy()
        updateTeamSpy = sandbox.spy()
        updateTeamScoreSpy = sandbox.spy()
        submitTeamScoreToDBSpy = sandbox.spy()
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

    it('should not contain a `Connect(Timer)` component if not admin', () => {

        expect(component.find('Connect(Timer)').exists()).to.be.false()

    })

    it('should contain a `Connect(Timer)` component if admin', () => {

        component.setProps({ parentId: 'team-1' })

        expect(component.find('Connect(Timer)').exists()).to.be.true()

    })

    describe('Given user is not `admin` and `currentQuestion` exists', () => {

        beforeEach(() => {
            component.setProps({ parentId: 'team-1', currentQuestion: 'How many days in a year?' })
        })

        it('should render a `span` with a specific class name that contains the current question', () => {

            expect(component.find('.current-question').text()).to.equal('Current Question: How many days in a year?')

        })    
    })

    describe('Given `isShowingAnswers` is true', () => {

        describe('Given `correctAnswer` exists', () => {

            it('should render a `span` with a specific class name that contains the correct answer', () => {

                component.setProps({ isShowingAnswers: true, correctAnswer: 1, parentId: 'team-1' })

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

                it('should have a key set to each team id', () => {
    
                    const teamListItem = component.find('.team-list-item')
    
                    expect(teamListItem.first().key()).to.equal(component.state().teams[0].id)
    
                })
    
                it('should contain a `span` elements with proper class names', () => {            
                    
                    const teamListItem = component.find('.team-list-item')   
    
                    expect(teamListItem.first().find('span').length).to.equal(2)
    
                })
    
                it('should render a `span` with a team answer for every team', () => {
    
                    expect(component.find('.team-answer').length).to.equal(component.state().teams.length)
    
                })

                describe('Given `.team-score`', () => {

                    describe('Given user is not an admin', () => {

                        beforeEach(() => {
                            component.setProps({ parentId: 'team-1' })
                        })

                        it('should contain a `span` to show each team score', () => {

                            expect(component.find('.team-score').length).to.equal(component.state().teams.length)
                        })
    
                        it('should not contain a `decrement-team-score-button` and a `increment-team-score-button` if not admin', () => {
                            
                            expect(component.find('.decrement-team-score-button').exists()).to.be.false()
    
                            expect(component.find('.increment-team-score-button').exists()).to.be.false()                         
    
                        }) 
                    })
                   
                    describe('Given user is an admin', () => {

                        beforeEach(() => {
                            component.setProps({ parentId: 'admin' })
                        })

                        it('should contain a `span` to show each team score', () => {

                            expect(component.find('.team-score').length).to.equal(component.state().teams.length)
                        })

                        it('should contain a `decrement-team-score-button` and a `increment-team-score-button` if admin', () => {
    
                            expect(component.find('.decrement-team-score-button').length).to.equal(component.state().teams.length)
    
                            expect(component.find('.increment-team-score-button').length).to.equal(component.state().teams.length)                            
    
                        })    
    
                        describe('When either button is clicked', () => {
    
                            beforeEach(() => {
                                component.setProps({ parentId: 'admin' })
                            })

                            it('should call `updateTeam` and `submitTeamScoreToDB`', () => {
   
                                component.find('.decrement-team-score-button').first().simulate('click')
    
                                sinon.assert.calledOnce(updateTeamSpy)
                                sinon.assert.calledOnce(submitTeamScoreToDBSpy)
    
                               component.find('.increment-team-score-button').first().simulate('click')
    
                                sinon.assert.calledTwice(updateTeamSpy)  
                                sinon.assert.calledTwice(submitTeamScoreToDBSpy)                                
    
                            })
                        })    
                    })                    
                })
        })
    })

    describe('When componentWillReceiveProps() is called', () => {

        it('should update teams based on their scores', () => {

            const teams = {
                'admin': { answer: 10, score: 0, isSubmitted: false },
                'team-1': {  answer: 5, score: 2, isSubmitted: false },
                'team-2': {  answer: 11, score: 10, isSubmitted: false }  
            }   

            component.setState({ teams })
            component.setProps({ teams, answeredFirst: false })

            const sortedByScore = [
                 { answer: 11, score: 10, isSubmitted: false , id: 'team-2', answeredFirst: false },      
                 { answer: 5, score: 2, isSubmitted: false,  id: 'team-1', answeredFirst: false } 
            ]

            expect(component.state().teams).to.equal(sortedByScore)

        })    
        
        it('should update teams order based on the time the teams submitted their answers', () => {

            const teams = { 
                'admin': { answer: 10, score: 0, isSubmitted: true,  id: 'admin', answeredFirst: true, answeredAt: 1522676002879 },
                'team-1': {  answer: 5, score: 10, isSubmitted: true, id: 'team-1', answeredFirst: false, answeredAt: 1522676002895 },
                'team-2': {  answer: 11, score: 2, isSubmitted: true, id: 'team-2', answeredFirst: true, answeredAt: 1522676002880 } 
            }

            component.setState({ teams })
            component.setProps({ teams })

            const sortedByWhoAnsweredFirst = [
                { answer: 11, score: 2, isSubmitted: true , id: 'team-2', answeredFirst: true, answeredAt: 1522676002880 },      
                { answer: 5, score: 10, isSubmitted: true,  id: 'team-1', answeredFirst: false, answeredAt: 1522676002895 } 
           ]

           expect(component.state().teams).to.equal(sortedByWhoAnsweredFirst)

        })

        it('should update teams order based on teams who have not submitted their answers', () => {

            const teams = { 
                'admin': { answer: 10, score: 0, isSubmitted: true,  answeredFirst: true, answeredAt: 1522676002879 },
                'team-1': {  answer: 5, score: 10, isSubmitted: true,  answeredFirst: false, answeredAt: 0 },
                'team-2': {  answer: 11, score: 2, isSubmitted: true, answeredFirst: true, answeredAt: 1522676002880 } 
            }

            component.setState({ teams })
            component.setProps({ teams })

            const sortedByAnsweredTimestamp = [
                { answer: 11, score: 2, isSubmitted: true , id: 'team-2', answeredFirst: true, answeredAt: 1522676002880 },      
                { answer: 5, score: 10, isSubmitted: true,  id: 'team-1', answeredFirst: false, answeredAt: 0 } 
           ]

           expect(component.state().teams).to.equal(sortedByAnsweredTimestamp)

        })
    })
})