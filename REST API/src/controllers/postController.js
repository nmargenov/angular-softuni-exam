const { postWithImage } = require('../managers/pictureManager');
const { createPost } = require('../managers/postManager');
const { mustBeAuth } = require('../middlewares/authMiddlewares');
const { formatErrorMessage } = require('../utils/errorHandler');

const router = require('express').Router();

const paths = {
    posts: '/',
}


router.post(paths.posts, mustBeAuth, async (req, res) => {
    try {
        const data = await postWithImage(req, res);
        const { image, description, owner } = data;
        if(owner != req.user._id){
            throw new Error("Unautorized!");
        }
        const post = await createPost(description, owner, image);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

module.exports = router;