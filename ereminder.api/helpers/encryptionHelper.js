'use string'

const crypto = require('crypto');
const algorithm = 'aes-128-cbc';
const password = 'testpassword';

exports.Encrypt = function(text) {
    var ciper = crypto.createCipher(algorithm, password);
    var crypted = ciper.update(text, 'utf8', 'hex')
    crypted += ciper.final('hex');

    return crypted;
}

exports.Decrypt = function(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8');

    return decrypted;
}

exports.MD5 = function(text) {
    return crypto.createHash('md5').update(text).digest("hex");
}