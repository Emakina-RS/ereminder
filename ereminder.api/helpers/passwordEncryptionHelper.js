'use strict'

const bcrypt = require('bcrypt');
const saltRounds = 10;

 module.exports.getEncryptedValue = async (plainValue, next) => {

    return bcrypt.hash(plainValue, saltRounds).then(next);
}


module.exports.compare = async (plainValue, hash , next) => {

    return bcrypt.compare(plainValue, hash).then(next);
}
