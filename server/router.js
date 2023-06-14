const router = require('express').Router();

const authController = require('./controllers/authController');
const entriesController = require('./controllers/entriesController');


router.use('/auth', authController);
router.use('/login-entries', entriesController);


module.exports = router;