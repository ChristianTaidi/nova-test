const {MongoClient} = require("mongodb")
const dbUsers = require('./db-user')
const dbNominations = require('./db-nomination')

var client
async function init(mongoUrl) {
    console.log('Initializing mongo client')
    let url = mongoUrl || "mongodb://localhost:27017/MyDb"
    client = new MongoClient(url)
    const database = client.db('test-db')
    await dbUsers.initUsers(database)
    await dbNominations.initNominations(database)
}

async function close(){
    client.close()
}

module.exports = {
    init,
    close,
    ...dbUsers,
    ...dbNominations,
}
