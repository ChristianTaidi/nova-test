//var nominations
var nominations

exports.initNominations = async (database) => {
    //nominations = []
    nominations = database.collection("nominations")
}

exports.dbAddNomination = async (nomination)=>{
    //nominations.push(nomination)
    if(await nominationExists(nomination)){
        return 
    }
    const result = await nominations.insertOne(nomination);
}
async function nominationExists(nomination){
    const foundNomination = await exports.dbFindNominationByEmail(nomination.email)    
    return foundNomination
}
exports.readAllNominations = async ()=>{
    //return nominations
    const result = await nominations.find()
    return result.toArray()
}

exports.dbFindNominationByEmail = async (email)=>{

    //return nominations.find(nomination => nomination.email === email)
    const query = { email: email};

    return nominations.findOne(query)
}

exports.dbDeleteAllNominations = async () => {
    nominations.deleteMany({})
}


