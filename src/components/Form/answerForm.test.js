import { expect } from 'code'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import React from 'react'
import { AnswerForm } from './answerForm'

describe('Given `AnswerForm`' ,() => {
    let sandbox,
        submitAnswerSpy

    const parentId = 'team-1'

    const mockTeamsSubmittedProp = {
        'admin': { answer: 1, score: 0, isSubmitted: true },
        'team-1': {  answer: 1, score: 0, isSubmitted: true },
        'team-2': {  answer: 1, score: 0, isSubmitted: true }  
    }
    
    const mockTeamsNotSubmittedProp = {
        'admin': { answer: 1, score: 0, isSubmitted: false },
        'team-1': {  answer: 1, score: 0, isSubmitted: false },
        'team-2': {  answer: 1, score: 0, isSubmitted: false }  
    }

    function requiredProps(overrides= {}) {
        return {
            teams: mockTeamsSubmittedProp,
            submitAnswer: submitAnswerSpy,
            id: parentId,
            ...overrides
        }
    }

    function renderComponent(props=requiredProps()) {
        const newProps = requiredProps(props);
        return shallow(<AnswerForm {...newProps}/>)

    }
    
    beforeEach(() => {
        sandbox = sinon.createSandbox()
        submitAnswerSpy = sandbox.spy()
    })
    
    afterEach(() => {
    
        sandbox.restore()
    })

    it('it should contain a `div` tag', () => {

        const component = renderComponent()
       
        expect(component.find('.form').type()).to.equal('div') 
           
    })

    it('it should contain a `span` with a proper class name', () => {

        const component = renderComponent()
       
        expect(component.find('.team-name').type()).to.equal('span') 
           
    })

    it('it should contain a `Formik` form', () => {

        const component = renderComponent()
        
        expect(component.find('Formik').length).to.equal(1) 

    })

    describe('Given `Formik` form',() => {

        it('it should contain a `form`', () => {

            const component = renderComponent()
            const form = component.find('Formik').dive().find('form')
          
            expect(form.length).to.equal(1) 
    
        })           
        
        it('it should start with initial values', () => {
            
            const component = renderComponent()
            const formikForm = component.find('Formik')

            expect(formikForm.props().initialValues.answer).to.equal('')
            expect(formikForm.props().initialValues.id).to.equal(parentId)
    
        })

        it('it should contain a `input` and a `button` inside the form', () => {

            const component = renderComponent()
            const input = component.find('Formik').dive().find('.answer-input')
            const button = component.find('Formik').dive().find('.answer-submit-btn')

            expect(input.length).to.equal(1)
            expect(button.length).to.equal(1)
                    
        })

        describe('Given the `button`', () => {

            describe('if the parent is `admin`', () => {

                it('should be `disabled`', () => {

                    const component = renderComponent({ currentTime: 0, id: 'admin' })

                    expect(component.find('Formik').dive().find('.answer-submit-btn').props().disabled).to.be.true();

                })

            })

        })
    })

    describe('When teams are present', () => {

        describe('and the parent team has submitted an answer', () => {

            describe('and the parent isn\'t the `admin`', () => {

                it('should render a `span.is-submitted`', () => {

                    const component = renderComponent()

                    expect(component.find(`span.is-submitted`).exists()).to.be.true()

                })

            })

            describe('and the parent is the `admin`', () => {

                it('should not render a `span.is-submitted`', () => {

                    const component = renderComponent({ id: 'admin' })

                    expect(component.find(`span.is-submitted`).exists()).to.be.false()                    

                })

            })

        })

        describe('and the parent team has not submitted an answer', () => {

            describe('and the `currentTime` is at 0', () => {

                describe('and the parent isn\'t the `admin`', () => {

                    it('should render a `span.out-of-time`', () => {
    
                        const component = renderComponent({ teams: mockTeamsNotSubmittedProp, currentTime: 0 })
    
                        expect(component.find(`span.out-of-time`).exists()).to.be.true()
    
                    })
    
                })
    
                describe('and the parent is the `admin`', () => {
    
                    it('should not render a `span.out-of-time`', () => {
    
                        const component = renderComponent({ teams: mockTeamsNotSubmittedProp, currentTime: 0, id: 'admin' })
    
                        expect(component.find(`span.out-of-time`).exists()).to.be.false()                    
    
                    })
    
                })

            })

        })

    })
})