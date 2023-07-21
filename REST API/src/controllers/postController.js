const { postWithImage } = require('../managers/pictureManager');
const { createPost, getAllPosts, getPostById, likePost, deletePostById, editPost, deleteExistingImage, writeComment, deleteComment } = require('../managers/postManager');
const { mustBeAuth } = require('../middlewares/authMiddlewares');
const { formatErrorMessage } = require('../utils/errorHandler');

const router = require('express').Router();

const paths = {
    post: '/:postId',
    posts: '/',
    followingPost: '/following',
    like: '/like/:postId',
    deleteExistingImage: '/deleteImage/:postId',
    comment:'/comment/:postId',
    commentWithId:'/comment/:postId/:commentId',
}

router.get(paths.posts, async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.get(paths.followingPost, mustBeAuth, async (req, res) => {
    try {
        const loggedInUser = req.user?._id;
        const posts = await getAllPosts(loggedInUser);
        res.status(200).json(posts);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.post(paths.posts, mustBeAuth, async (req, res) => {
    try {
        const data = await postWithImage(req, res);
        const { image, description, owner } = data;
        if (owner != req.user._id) {
            throw new Error("Unautorized!");
        }
        const post = await createPost(description, owner, image);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.get(paths.post, async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await getPostById(postId);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});


router.post(paths.like, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const post = await likePost(postId, userId);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.delete(paths.post, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const loggedInUser = req.user._id;
        const post = await deletePostById(postId, loggedInUser);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.patch(paths.post, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const loggedInUser = req.user?._id;
        const data = await postWithImage(req, res);
        const { image, description } = data;
        const post = await editPost(postId, description, image, loggedInUser);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.delete(paths.deleteExistingImage, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const loggedInUser = req.user?._id;
        const post = await deleteExistingImage(postId, loggedInUser);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.post(paths.comment, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;
        const comment = req.body.comment?.trim();
        const post = await writeComment(postId, userId, comment);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

router.delete(paths.commentWithId, mustBeAuth, async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const loggedInUser = req.user._id;
        const post = await deleteComment(postId, commentId, loggedInUser);
        res.status(200).json(post);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

module.exports = router;