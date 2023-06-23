const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const validEmail = require('../middleware/email-validator');
const validPassword = require('../middleware/password-validator');

router.post('/signup', validEmail, validPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;