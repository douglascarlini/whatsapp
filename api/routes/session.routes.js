const express = require('express');
const router = express.Router();

const controller = require('../controllers/session.controller');

router.get('/:session', controller.create);
router.delete('/:session', controller.remove);

module.exports = router;