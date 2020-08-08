const express = require('express');
const router = express.Router();
const { authController } = require('../controller');
const { auth } = require('../helper/jwt');

const {
    Accounts,
    Register,
    Login,
    KeepLogin,
    Verification,
    ChangePassword,
} = authController;

router.get('/all', Accounts);
router.post('/register', Register);
router.post('/login', Login);
router.post('/keep-login', auth, KeepLogin);
router.post('/verification', Verification);
router.post('/change-password', auth, ChangePassword);

module.exports = router;
