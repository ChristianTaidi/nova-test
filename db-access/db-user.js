const bcrypt = require ('bcrypt')

//var users
var users

exports.initUsers = async (database)=>{
    //users = []
    users = database.collection("users")
}

exports.dbAddUser = async (user) => {
    //users.push(user)
    const result = await users.insertOne(user);
    console.log(result)
}

exports.dbFindUserByEmail = async (email) => {
    //return users.find(user => user.email == email)
    
    const query = { email};
    const options = {
        // Include the email, the hashed pw and the roles
        projection: { _id: 0, email: 1, password: 1 , roles: 1},
      };
    return users.findOne(query, options);
}

exports.dbDeleteUserByEmail = async (email) => {
    const query = { email };
    const result = await users.deleteOne(query);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
}

exports.dbDeleteAllUsers = async () => {
    await users.deleteMany({});
}
