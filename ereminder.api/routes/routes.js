var express = require('express');
var router  = express.Router();
var controllers =  require('../controllers');

router.post('/register',controllers.register);
router.post('/authenticate',controllers.authenticate);