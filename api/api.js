const express = require('express')
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const nominationsController = require('./nomination-controller')
const authController = require('./auth-controller')
const app = express();

exports.init = ()=>{
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    
    app.get('/', (req, res) => {
      res.send('hello world')
    })

    // Auth endpoints
    app.post('/register',authController.handleRegisterUser)
    app.post('/registerAdmin',authController.handleRegisterAdmin)
    app.post('/login',authController.handleLogin)
    
    app.use('/nominations', (req, res, next) => {
        const authHeader = req.headers["authorization"]
        if (!authHeader) return res.status(401).send("Unauthorized")
        const token = authHeader.split(" ")[1]
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) return res.status(400).send("Token not present")
        const decoded = jwt.verify(token, 'secret')
        if (!decoded.roles.find(role => role.toLowerCase() === 'admin')){
            return res.send({
                error: true,
                statusCode: 401,
                message: 'Unauthorized'
            })
        }
        next()
    })
    app.use('/nominate', (req, res, next) => {
        const authHeader = req.headers["authorization"]
        if (!authHeader) return res.status(401).send("Unauthorized")
        const token = authHeader.split(" ")[1]
        //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        if (token == null) return res.status(400).send("Token not present")
        const decoded = jwt.verify(token, 'secret')
        if (!decoded.roles.find(role => role.toLowerCase() === 'user')){
            res.send({
                error: true,
                statusCode: 401,
                message: 'Unauthorized'
            })
            return
        }
        req.body.nominator = decoded.email
        next()
    })
    // Nomination endpoints
    app.post('/nominate',nominationsController.handlePostNomination)
    app.get('/nominations',nominationsController.handleGetAllNominations)
    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
}
