const nominationsDB = require('../db-access/db-nomination')
const validator = require('../utils/validator')
const sanitizer = require('../utils/sanitizer')
const email = require('../utils/email')
const dbClient = require('../db-access/client')

const TALENT_SCORE_THRESHOLD = 8

exports.handlePostNomination = async (req,res) =>{
    const nomination = req.body
    const sanitizedNomination = sanitizer.sanitizeNomination(nomination)
    const result = validator.validateNomination(sanitizedNomination)
    if (result.error){
        return res.send(result)
    }
    if (await nominationExists(sanitizedNomination)){
        return res.send({
            error: true,
            statusCode: 409,
            message: 'Candidate already exists'
        })
    }
    if (!hasValidScore(nomination)){
        email.sendInvalidNomination(nomination)
        return res.send({
            error: true,
            statusCode: 400,
            message: 'Invalid candidate score'
        })
    }
    await dbClient.init()
    nominationsDB.dbAddNomination(nomination)
    await dbClient.close()
    return res.sendStatus(200)
}

function hasValidScore(nomination){
    return nomination.talentScore >= TALENT_SCORE_THRESHOLD
}

exports.handleGetAllNominations = async (req,res) => {
    await dbClient.init()
    const nominations = await nominationsDB.readAllNominations()
    await dbClient.close()
    return res.send({
        error:false,
        statusCode: 200,
        nominations
    })

}

async function nominationExists(nomination){
    await dbClient.init()
    const existing = await dbClient.dbFindNominationByEmail(nomination.email)
    await dbClient.close()
    return existing
}
