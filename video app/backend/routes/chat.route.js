const express = require('express');
const {protectedRoute} = require('../middleware/auth.middleware');
const { getStreamToken } = require('../controller/chat.controller');

const router = express.Router();

router.get('/token', protectedRoute, getStreamToken);

module.exports = router;