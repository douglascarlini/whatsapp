const express = require('express');
const router = express.Router();

const validate = require('../middlewares/validate.middleware');
const controller = require('../controllers/schedule.controller');

router.post('/:session/:number', validate, controller.create);

module.exports = router;