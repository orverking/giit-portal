const express = require('express');
const { getPublicContent } = require('../controllers/publicController');

const router = express.Router();

router.get('/content', getPublicContent);

module.exports = router;
