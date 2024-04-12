/* eslint no-use-before-define: 0 */
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

  it('should successfully login with valid credentials', () => {
    cy.get('#email').type('validemail@example.com')
    cy.get('#password').type('validpassword')
    cy.get('form').submit()
    cy.url().should('eq', 'http://localhost:5173/')
  })
})