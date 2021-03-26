/// <reference types="cypress" />
let UserToken = ''
context('Window', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000')
  })

  it('cy.window() - get the global window object', () => {
    // https://on.cypress.io/window
    cy.window().should('have.property', 'top')
  })

  it('cy.document() - get the document object', () => {
    // https://on.cypress.io/document
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8')
  })

  it('cy.title() - get the title', () => {
    // https://on.cypress.io/title
    cy.title().should('include', 'Video').should('include', 'Poker').should('include', 'Academy')
  })

  it('remove the test user if found', () => {})

  it('The play button should be inactive', () => {
    cy.get('#link-inactive').should('be.visible')
  })

  it('The login button should be visible', () => {
    cy.get('#link-login').should('be.visible')
  })  

  it('create a new user in strapi', () => {
    const makeUserEndpoint = 'http://localhost:1337/auth/local/register'
    const testUserData = {"confirmed":true,"blocked":false,"Credits":100,"username":"removeme","email":"nothing@example.com","password":"thisgoodpass"}
    cy.request('POST', makeUserEndpoint, testUserData).then(
      (response) => {
        console.log( response.body, response.body.jwt )
        UserToken = response.body.jwt
        // response.body is automatically serialized into JSON
        expect(response.body.user).to.have.property('username', 'removeme')
        window.localStorage.setItem('token', UserToken)
        window.localStorage.setItem('user', JSON.stringify(response.body.user))
      }
    )
    cy.saveLocalStorage()
  })

  it('setup an authenticated session with the token', () => {
    cy.restoreLocalStorage()
    // cy.wait(5000)
    console.log( localStorage, 'WHEEE' )
  })

  it('The play button should be active', () => {
    cy.restoreLocalStorage()
    cy.get('#link-play').should('be.visible')
  })

  it('Play a Hand of Classic Video Poker', () => {
    const WAIT = 200
    cy.restoreLocalStorage()
    cy.get('#link-play a').click()
    cy.wait(WAIT)
    cy.get('#play-classic').click()
    cy.wait(WAIT)
    cy.get('#game-button-start').click()
    cy.wait(WAIT)
    cy.get('#game-button-score').click()
    cy.wait(WAIT)
    cy.get('#status').should('contain', 'score')
    cy.wait(WAIT)
  })

  it('User can log out', () => {
    cy.restoreLocalStorage()
    cy.get('#link-logout').should('be.visible')
    cy.get('#link-logout a').click()
    cy.wait(200)
    cy.get('#link-login').should('be.visible')
    cy.saveLocalStorage()
  })

  it('remove the new user from strapi', () => {
    cy.restoreLocalStorage()
    cy.request({
      method: "GET",
      url: 'http://localhost:1337/remove-my-account',
      auth: {
        'bearer': UserToken
      }
    }).then(
      (response) => {
        // console.log( response.body, "REMOVED A USER?" )
        expect(response.body).to.have.property('username', 'removeme')
      }
    )
  })
})
