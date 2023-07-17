const router = require('express').Router();

const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

const paths = {
    users:'/api/users',
    posts:'/api/posts',
}

router.use(paths.users,userController);
router.use(paths.posts,postController);

module.exports = router;