const { startShutdownByError } = require("inits")
const webServer = require("./api/api")
const dbClient =  require('./db-access/client')

async function start(){
    // Initialize sample data
    await dbClient.init()
    await initMockUsers()
    await initMockNominations()
    await dbClient.close()

    webServer.init()
}

async function initMockUsers(){
    const encodedPassword = await bcrypt.hash('test', 10)
    const users = [
        {
            email:'test@admin',
            password: encodedPassword,
            roles: ['user','admin']
        },
        {
            email:'test@user',
            password: encodedPassword,
            roles: ['user']
        },
    ]
    users.forEach(async user => await exports.dbAddUser(user))
}

async function initMockNominations(){
    const nominations = [
        {
            email:'nominated@user1',
            description: 'lorem ipsum,',
            communityParticipationScore:2,
            talentScore: 9,
            nominator: 'test@user'
        },
        {
            email:'nominated@user2',
            description: 'lorem ipsum,',
            communityParticipationScore:6,
            talentScore: 10,
            nominator: 'test@user'
        },
        {
            email:'nominated@user3',
            description: 'lorem ipsum,',
            communityParticipationScore:4,
            talentScore: 8,
            nominator: 'test@user'
        },
        {
            email:'nominated@user4',
            description: 'lorem ipsum,',
            communityParticipationScore:2,
            talentScore: 4,
            nominator: 'test@user'
        },
    ]
    nominations.forEach(async nomination =>{ 
        await exports.dbAddNomination(nomination)
    })
}

start() 