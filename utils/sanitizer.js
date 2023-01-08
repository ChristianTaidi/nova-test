function Nomination(){
    return {
        email:'',
        description: '',
        communityParticipationScore:0,
        talentScore: 0,
        nominator: ''
    }
}
exports.sanitizeNomination = (rawNomination)=>{
    const sanitizedNomination = Nomination()
    sanitizedNomination.email = rawNomination.email
    sanitizedNomination.description = rawNomination.description
    sanitizedNomination.communityParticipationScore = parseInt(rawNomination.communityParticipationScore) || 0
    sanitizedNomination.talentScore = parseInt(rawNomination.talentScore) || 0
    sanitizedNomination.nominator = rawNomination.nominator
    return sanitizedNomination
}