exports.validateNomination = (nomination) => {
    if (!nomination.email || !nomination.talentScore || !nomination.nominator) {
        return badRequestResponse
    }

    return okResponse
}

exports.validateUser = (user) => {
    // ToDo validate email
    return okResponse
}

const badRequestResponse = {
    error: true,
    statusCode: 400,
    message: 'Bad request, incomplete request body'
}

const okResponse = {
    error:false,
    statusCode: 200,
    message: 'OK'
}