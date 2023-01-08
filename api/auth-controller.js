const { validateUser } = require("../utils/validator")
const jwt = require("jsonwebtoken")
const userDb = require("../db-access/client")
const bcrypt = require ('bcrypt')
const dbClient = require('../db-access/client')

exports.handleRegisterUser = async (req,res) => {
    const user = req.body
    const validateResp = validateUser(user)
    if (validateResp.error) {
        res.send(validateResp)
    }

    user.password = await bcrypt.hash(req.body.password, 10)
    user.roles = ['user']
    await dbClient.init()
    await userDb.dbAddUser(user)
    await dbClient.close()
    res.send(validateResp)
}
exports.handleRegisterAdmin = async (req,res) => {
    const user = req.body
    const isValid = validateUser(user)
    if (!isValid) {
        res.send({
            error: true,
            statusCode: 400,
            message: 'Bad request, invalid user'
        })
    }

    user.password = await bcrypt.hash(req.body.password, 10)
    user.roles = ['user','admin']
    await dbClient.init()
    await userDb.dbAddUser(user)
    res.send({
        error:false,
        statusCode: 200,
        message: 'OK'
    })
    await dbClient.close()
}
exports.handleLogin = async (req,res) => {
    const requestUser = req.body
    await dbClient.init()
    const user = await userDb.dbFindUserByEmail(requestUser.email)
    await dbClient.close()
    if (user == null) return res.status(404).send ("User does not exist!")
    if (await bcrypt.compare(requestUser.password, user.password)) {
        const accessToken = generateAccessToken(user)
        res.json ({accessToken: accessToken})
    } else {
        res.status(401).send("Password Incorrect!")
    }
}
function generateAccessToken(user) {
    return jwt.sign(user, 'secret', {expiresIn: "2d"}) 
}

