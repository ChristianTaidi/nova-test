
const dbClient = require('../db-access/client')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-subset'))

describe('#dbAddUser',() => {
    it('Should add the user to the database',async ()=>{
        await dbClient.init('')
        const user = { 
            email:'test@adduser',
            password: 'test',
            roles: ['user','admin']
        }
        dbClient.dbAddUser(user)
        const result = await dbClient.dbFindUserByEmail(user.email)
        expect(result.email).to.equal(user.email)
        await dbClient.close()
    })
})

describe('#dbFindUserByEmail',() => {
    it('Should not find inexistent user',async ()=>{
        await dbClient.init('')
        const fakeEmail = 'not@existing'
        const user = await dbClient.dbFindUserByEmail(fakeEmail)
        expect(user).null
        await dbClient.close()
    })
    it('Should find default user',async ()=>{
        await dbClient.init('')
        const fakeEmail = 'test@user'
        const user = await dbClient.dbFindUserByEmail(fakeEmail)
        expect(user).not.undefined
        await dbClient.close()
    })
})

describe('#dbAddNomination',() => {
    it('Should insert new nomination',async ()=>{
        await dbClient.init('')
        const nomination = {
            email:'nominated@test',
            description: 'lorem ipsum,',
            communityParticipationScore:2,
            talentScore: 9,
            nominator: 'test@user'
        }
        await dbClient.dbAddNomination(nomination)
        const nominations = await dbClient.readAllNominations()
        expect(nominations).to.be.an("array").to.containSubset([nomination])
        await dbClient.close()
    })
})

describe('#readAllNominations',() => {
    it('Should return a list of results',async ()=>{
        await dbClient.init('')
        const nominations = await dbClient.readAllNominations()
        expect(nominations).be.an('array')
        await dbClient.close()
    })
})

describe('#dbFindNominationByEmail',() => {
    it('Should not find nomination with inexistent email',async ()=>{
        await dbClient.init('')
        const fakeEmail = 'non@existent'
        const nomination = await dbClient.dbFindNominationByEmail(fakeEmail)
        expect(nomination).null
        await dbClient.close()
    })
    it('Should find nomination with default email',async ()=>{
        await dbClient.init('')
        const defaultEmail = 'nominated@user1'
        const nomination = await dbClient.dbFindNominationByEmail(defaultEmail)
        expect(nomination).to.not.undefined
        await dbClient.close()
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