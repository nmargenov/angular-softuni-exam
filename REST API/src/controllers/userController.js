const { login, register, getUser } = require('../managers/userManager');
const { mustBeGuest } = require('../middlewares/authMiddlewares');
const { formatErrorMessage } = require('../utils/errorHandler');

const router = require('express').Router();

const paths = {
    register: '/register',
    login: '/login',
    user: '/:username',
}

router.post(paths.register, mustBeGuest, async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const lastName = req.body.lastName?.trim();
        const firstName = req.body.firstName?.trim();
        const password = req.body.password?.trim();
        const rePassword = req.body.rePassword?.trim();
        const email = req.body.email?.trim();
        const birthdate = req.body.birthdate?.trim();
        const token = await register(username, firstName, lastName, rePassword, password, email, birthdate);
        res.status(201).json(token);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.post(paths.login, mustBeGuest, async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();
        const token = await login(username, password);
        res.status(200).json(token);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(400).send({ message: error });
    }
});

router.get(paths.user, async (req, res) => {
    try {
        const username = req.params.username;
        const user = await getUser(username);
        if (!user) {
            throw new Error("Not Found!");
        }
        res.status(200).json(user);
    } catch (err) {
        const error = formatErrorMessage(err);
        res.status(404).send({ message: error });
    }
});

module.exports = router;