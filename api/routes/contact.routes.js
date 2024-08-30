const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/contact.controller');

router.get('/:session', validate, controller.search);

module.exports = router;