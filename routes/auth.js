const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { login, logout, logoutAll } = require('../controller/auth');

router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);

module.exports = router;
