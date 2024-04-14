/* eslint no-use-before-define: 0 */
import { slowCypressDown } from "cypress-slow-down"
slowCypressDown(400)
describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login')
  })

  it('should display email validation message when email is invalid', () => {
    cy.get('#email').type('invalidemail')
    cy.contains('Must contain @ and a . (dot) followed by a domain').should('be.visible')
  })

  it('should navigate to registration page when "Register" button is clicked', () => {
    cy.contains('Register').click()
    cy.url().should('include', '/register')
  })
  it('should fail login with Unauthorized message', ()=>{
    cy.get('#email').type('notvalid@mail.com')
    cy.get('#password').type('noPass')
    cy.get('#loginBtn').click()
    cy.contains('Unauthorized')
  })
  it('should successfully login with valid credentials', () => {
    cy.get('#email').type('markneu22@gmail.com')
    cy.get('#password').type('RandomPass1234!!')
    cy.get('#loginBtn').click()
    cy.url().should('eq', 'http://localhost:5173/')
  })
  it('should successfully login then logout', ()=> {
    cy.get('#email').type('markneu22@gmail.com')
    cy.get('#password').type('RandomPass1234!!')
    cy.get('#loginBtn').click()
    cy.url().should('eq', 'http://localhost:5173/')
    cy.get('#logoutBtn').click()
    cy.contains('Chat with your friends in real time!')
  })
})