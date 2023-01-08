const authController = require('../api/auth-controller')
const nominationController = require('../api/nomination-controller')
const dbClient = require('../db-access/client')
const chai = require('chai')
const expect = chai.expect

describe('#register',() => {
    it('Should register valid user',async ()=>{
        const user = { 
            email:'test@adduser',
            password: 'test',
        }
        const req = {
            body: user
        }
        var responseStatusCode
        var responseError
        const res = {
            send: (responseBody) =>{
                responseStatusCode = responseBody.statusCode
                responseError = responseBody.error
            }
        }
        await authController.handleRegisterUser(req,res)
        expect(responseStatusCode).equal(200)
        expect(responseError).false
        dbClient.init('')
        const registeredUser = await dbClient.dbFindUserByEmail(user.email)
        expect(registeredUser.roles).to.not.include('admin')
        dbClient.close()
    })
    it('Should register valid admin',async ()=>{
        const user = { 
            email:'test@addadmin',
            password: 'test',
        }
        const req = {
            body: user
        }
        var responseStatusCode
        var responseError
        const res = {
            send: (responseBody) =>{
                responseStatusCode = responseBody.statusCode
                responseError = responseBody.error
            }
        }
        await authController.handleRegisterAdmin(req,res)
        expect(responseStatusCode).equal(200)
        expect(responseError).false
        dbClient.init('')
        const registeredUser = await dbClient.dbFindUserByEmail(user.email)
        expect(registeredUser.roles).to.include('admin')
        dbClient.close()
    })
})

describe('#login',() => {
    it('Should login with user',async ()=>{
        const user = { 
            email:'test@adduser',
            password: 'test',
        }
        const req = {
            body: user
        }
        var response
        const res = {
            json: (responseBody) =>{
                response = responseBody
            }
        }
        await authController.handleLogin(req,res)
        expect(response).to.not.empty
        const jwt = require("jsonwebtoken")

        const decoded = jwt.verify(response.accessToken, 'secret')

        expect(decoded.roles).to.include('user')
        expect(decoded.roles).to.not.include('admin')
        expect(decoded.email).to.equal(user.email)
    })
    it('Should login with admin',async ()=>{
        const user = { 
            email:'test@addadmin',
            password: 'test',
        }
        const req = {
            body: user
        }
        var response
        const res = {
            json: (responseBody) =>{
                response = responseBody
            }
        }
        await authController.handleLogin(req,res)
        expect(response).to.not.empty
        const jwt = require("jsonwebtoken")

        const decoded = jwt.verify(response.accessToken, 'secret')

        expect(decoded.roles).to.include('user')
        expect(decoded.roles).to.include('admin')
        expect(decoded.email).to.equal(user.email)
    })
})

describe('#postnomination',() => {
    it('Should record valid nomination',async ()=>{
        const nomination = { 
            email:'test@nominated1',
            description: 'nominating...',
            communityParticipationScore: 5,
            talentScore: 9,
            nominator: 'test@nominator'
        }
        const req = {
            body: nomination
        }
        var response
        var response
        const res = {
            send: (responseBody) =>{
                response = responseBody
            },
            sendStatus: (status) =>{
                response = {statusCode: status}
            }
        }
        await nominationController.handlePostNomination(req,res)
        expect(response).to.not.empty

        console.log(response.message)
        expect(response.statusCode).to.equal(200)
        expect(!response.error)
    })
    it('Should not record existing nomination',async ()=>{
        const nomination = { 
            email:'test@nominated1',
            description: 'nominating...',
            communityParticipationScore: 5,
            talentScore: 9,
            nominator: 'test@nominator'
        }
        await dbClient.init()
        await dbClient.dbAddNomination(nomination)
        await dbClient.close()
        const req = {
            body: nomination
        }
        var response
        var response
        const res = {
            send: (responseBody) =>{
                response = responseBody
            },
            sendStatus: (status) =>{
                response = {statusCode: status}
            }
        }
        await nominationController.handlePostNomination(req,res)
        expect(response).to.not.empty

        console.log(response.message)
        expect(response.statusCode).to.equal(409)
        expect(response.error)
    })
    it('Should not record invalid candidate',async ()=>{
        const nomination = { 
            email:'test@nominatedinvalid',
            description: 'nominating...',
            communityParticipationScore: 5,
            talentScore: 5,
            nominator: 'test@nominator'
        }
        const req = {
            body: nomination
        }
        var response
        var response
        const res = {
            send: (responseBody) =>{
                response = responseBody
            },
            sendStatus: (status) =>{
                response = {statusCode: status}
            }
        }
        await nominationController.handlePostNomination(req,res)
        expect(response).to.not.empty

        console.log(response.message)
        expect(response.statusCode).to.equal(400)
        expect(response.error)
    })
    it('Should not record incomplete nomination',async ()=>{
        const nomination = { 
            description: 'nominating...',
            communityParticipationScore: 5,
            talentScore: 5,
            nominator: 'test@nominator'
        }
        const req = {
            body: nomination
        }
        var response
        var response
        const res = {
            send: (responseBody) =>{
                response = responseBody
            },
            sendStatus: (status) =>{
                response = {statusCode: status}
            }
        }
        await nominationController.handlePostNomination(req,res)
        expect(response).to.not.empty

        console.log(response.message)
        expect(response.statusCode).to.equal(400)
        expect(response.error)
    })
})

describe('#getAllNominations',() => {
    it('Should return existing nominations',async ()=>{
        const nomination = { 
            email:'test@nominated',
            description: 'nominating...',
            communityParticipationScore: 10,
            talentScore: 10,
            nominator: 'test@nominator'
        }
        await dbClient.init()
        await dbClient.dbAddNomination(nomination)
        await dbClient.close()
        const req = {}
        var response
        const res = {
            send: (responseBody) =>{
                response = responseBody
            }
        }
        await nominationController.handleGetAllNominations(req,res)
        expect(response).to.not.empty
        console.log(Object.entries(response))
        expect(response.nominations).to.be.an("array").to.containSubset([nomination])
    })

})


after(async () => {  
    await dbClient.init('')
    await Promise.all([
        dbClient.dbDeleteAllUsers(),
        dbClient.dbDeleteAllNominations()
    ])
    await dbClient.close()
})