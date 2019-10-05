const models = require('../models');
const passwordEncryptionHelper = require('../helpers/passwordEncryptionHelper');

module.exports.register = async function (body) {
    let result =  await passwordEncryptionHelper.getEncryptedValue(body.password, (hash) => {
         return createUser(hash, body);
    });

     return result;
}

async function createUser(hash, body) {
   return models.User.create({
        email: body.email,
        password: hash,
    })
    .then((newUser) => { return newUser; });
}