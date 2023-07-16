const router = require('express').Router();

const userController = require('./controllers/userController');

const paths = {
    users:'/api/users',
}

router.use(paths.users,userController);

module.exports = router;