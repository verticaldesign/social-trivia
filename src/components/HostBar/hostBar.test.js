import { expect } from 'code'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import React from 'react'
import { HostBar } from './hostBar'

describe('Given `HostBar`' ,() => {

    let component,
        sandbox,
        updateTeamSpy,
        fetchTeamsFromDBSpy,
        toggleShowAnswersSpy,
        setCurrentQuestionSpy,
        deleteTeamSpy,
        findMultipleWinnersSpy

    const teams = {  
        'admin': { answer: 15, answeredAt: 0, createdAt: 1522438852549, isSubmitted: false, score: 0  }, 
        'team-1': { answer: 15, answeredAt: 0, createdAt: 1522438852549, isSubmitted: false, score: 0  }, 
        'team-2': { answer: 13, answeredAt: 0, createdAt: 1522438852549, isSubmitted: false, score: 0  },
        'team-3': { answer: 11, answeredAt: 0, createdAt: 1522438852549, isSubmitted: false, score: 0  }
    }

    function requiredProps(overrides= {}) {
        return {
            updateTeam: updateTeamSpy,
            fetchTeamsFromDB: fetchTeamsFromDBSpy,
            toggleShowAnswers: toggleShowAnswersSpy,
            updateCurrentQuestion: setCurrentQuestionSpy,
            teams,
            deleteTeam: deleteTeamSpy,
            findMultipleWinners: findMultipleWinnersSpy,
            ...overrides
        }
    }

    function renderComponent(props=requiredProps()) {
        const newProps = requiredProps(props)
        return shallow(<HostBar {...newProps}/>)

    }

    beforeEach(() => {
        sandbox = sinon.createSandbox()
        updateTeamSpy = sandbox.spy()
        fetchTeamsFromDBSpy = sandbox.spy()
        toggleShowAnswersSpy = sandbox.spy()
        setCurrentQuestionSpy = sandbox.spy()
        deleteTeamSpy = sandbox.spy()
        findMultipleWinnersSpy = sandbox.spy()
        component = renderComponent()
    })

    afterEach(() => {    
        sandbox.restore()
    })
    
    it('it should exist as a `section` tag', () => {
        
        expect(component.type()).to.equal('section')

    })

    it('should contain a connected `AnswerForm` component with an id set as admin', () => {

        const answerForm = component.find('Connect(AnswerForm)')

        expect(answerForm.exists()).to.be.true()
        expect(answerForm.first().props().id).to.equal('admin')
    })

    it('should contain a connected `Timer` component', () => {

        expect(component.find('Connect(Timer)').exists()).to.be.true()
    })

    it('should contain a `input` and a `button` with proper class names', () => {

        expect(component.find('.question-input').type()).to.equal('input')
        expect(component.find('.question-submit-button').type()).to.equal('button')
        
    })

    describe('Given the `.question-input', () => {

        it('should update the `questionText` in state', () => {

            component.find('.question-input').simulate('change', {
                target: {
                    value: 'New question entered?'
                }
            })

            expect(component.state().questionText).to.equal('New question entered?')
        })
    })

    describe('Given `.question-submit-button`', () => {

        describe('When it is clicked', () => {

            it('should call `updateCurrentQuestion`', () => {

                component.find('.question-submit-button').simulate('click');

                sinon.assert.calledOnce(setCurrentQuestionSpy);

            })
        })
    })

    it('should contain a `button` to update teams', () => {

        expect(component.find('.update-teams-button').type()).to.equal('button')
    
    })
    
    it('should contain a `Link` to open the teams view', () => {
    
        expect(component.find('Link').exists()).to.be.true()
    
    })

    describe('Given `button`', () => {

        describe('When there are no teams', () => {

            it('should be disabled', () => {

                component = renderComponent({ teams: {} })

                expect(component.find('.update-teams-button').props().disabled).to.be.true()

            })
        })

        describe('When there are teams', () => {    
            
            it('should contain a `span` with the `correct-answer`', () => {

                component = renderComponent({ updateTeam: updateTeamSpy })

                expect(component.find('.correct-answer').text()).to.equal("Correct Answer: 15")

            })

            describe('when the `button` is clicked', () => {

                beforeEach(() => {


                })

                it('should call `updateTeam` and `toggleShowAnswers`', () => {

                    component = renderComponent({ updateTeam: updateTeamSpy })
                
                    component.find('.update-teams-button').simulate('click')
    
                    sinon.assert.called(updateTeamSpy)
                    sinon.assert.called(toggleShowAnswersSpy)
                    
                })  

                describe('when there are teams with no perfect answer', () => {
                   
                    it('should find multiple winners if there are any', () => {

                        let returnTeam, winnersMethod, sortedTeams, noExactAnswerTeams

                        returnTeam = [
                            'team-1', 'team-2'
                        ]
                        
                        winnersMethod = { findMultipleWinners: function (sortedTeams) {
                            return returnTeam
                        }};
                    
                        noExactAnswerTeams = {  
                            'admin': { answer: 15, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }, 
                            'team-1': { answer: 14, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }, 
                            'team-2': { answer: 14, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  },
                            'team-3': { answer: 11, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }
                        }

                        sortedTeams = [  
                            { answer: 14, answeredAt: 1522676002880, createdAt: 1522675973529, id: 'team-1' }, 
                            { answer: 14, answeredAt: 1522676002890, createdAt: 1522675973529, id: 'team-2' }, 
                            { answer: 11, answeredAt: 1522676002895, createdAt: 1522675973529, id: 'team-3' } 
                        ]
                        
                        findMultipleWinnersSpy = sandbox.spy(winnersMethod, "findMultipleWinners")
                        component.setProps({ teams: noExactAnswerTeams, findMultipleWinners: findMultipleWinnersSpy })

                        component.find('.update-teams-button').simulate('click')

                        winnersMethod.findMultipleWinners(sortedTeams)
                        sinon.assert.calledWith(findMultipleWinnersSpy, sortedTeams)
                        sinon.assert.match(findMultipleWinnersSpy.firstCall.returnValue, returnTeam)
                    })

                    it('should find no winners', () => {

                        let returnTeam, winnersMethod, sortedTeams, noExactAnswerTeams

                        winnersMethod = { findMultipleWinners: function (sortedTeams) {
                            return undefined
                        }};
                    
                        noExactAnswerTeams = {  
                            'admin': { answer: 15, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }, 
                            'team-1': { answer: 20, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }, 
                            'team-2': { answer: 20, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  },
                            'team-3': { answer: 20, answeredAt: 0, createdAt: 1522438852549, isSubmitted: true, score: 0  }
                        }

                        sortedTeams = []

                        
                        findMultipleWinnersSpy = sandbox.spy(winnersMethod, "findMultipleWinners")
                        component.setProps({ teams: noExactAnswerTeams, findMultipleWinners: findMultipleWinnersSpy })

                        component.find('.update-teams-button').simulate('click')

                        winnersMethod.findMultipleWinners(sortedTeams)
                        sinon.assert.calledWith(findMultipleWinnersSpy, sortedTeams)
                        sinon.assert.match(findMultipleWinnersSpy.firstCall.returnValue, returnTeam)
                        sinon.assert.calledOnce(findMultipleWinnersSpy)
                    })
                })                
            })        
        })        
    })

    it('should contain a `button` to show answers', () => {

        expect(component.find('.show-answers-button').type()).to.equal('button')        

    })

    describe('When the button is clicked', () => {

        it('should call `showAnswers`', () => {      

            component.find('.show-answers-button').simulate('click')
            
            sinon.assert.called(toggleShowAnswersSpy)

        })
    })

    describe('When componentWillReceiveProps() is called', () => {

        it('should update currentQuestion if there were changes', () => {

            component.setState({ currentQuestion: 'Is this a question?' })
            component.setProps({ currentQuestion: 'Is this a question?' })

            expect(component.state().currentQuestion).to.equal('Is this a question?')

        })    
        
        it('should call `deleteTeam` if team(s) are a day old', () => {

            const newTeams = { 
                'admin': { answer: 15, createdAt: 1522438893372 }, 
                'team-1': { answer: 15, createdAt: 1022438852549 }, 
                'team-2': { answer: 15, createdAt: 1122438852549 }, 
                'team-3': { answer: 15, createdAt: 1322438852549 } 
            }

            component.setState({ teams: newTeams })
            component.setProps({ teams: newTeams, deleteTeam: deleteTeamSpy })

            sinon.assert.called(deleteTeamSpy)

        })
    })
})