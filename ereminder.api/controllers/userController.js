var models  = require('../models');

async function register(request, response) {
    models.User.create({
        username: req.body.username,
        username: req.body.username,
  
      }).then(function() {
        res.redirect('/');
      });
}

async function authenticate(request, response) {

}

exports.register = register;
exports.authenticate = authenticate;
