const User = require("../models/User");

const bcrypt = require('bcrypt');
const { sign } = require("../utils/jwt");
const { SECRET } = require("../config/config");



exports.register = async (username, firstName, lastName, password, rePassword, email, birthdate) => {
    if (!password) {
        throw new Error("Password is required!");
    }
    if (password != rePassword) {
        throw new Error("Passwords don't match!");
    }

    if (password?.length < 6 || password?.length > 20) {
        throw new Error("Password must be at between 6 and 20 characters long!");
    }

    const year = birthdate?.split('-')[0];
    const isValidBirthdate = Number(year) >= 1900 && Number(year) <= 2023;

    if (!isValidBirthdate) {
        throw new Error('Birthdate must be between year 1900 and 2023!');
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
        throw new Error("Username is already in use!");
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new Error("Email is already in use!");
    }

    const bcryptPass = await bcrypt.hash(password, 10);

    const user = {
        username,
        firstName,
        lastName,
        password: bcryptPass,
        email,
        birthdate,
        bio: '',
        profilePicture: {
            data: `src/profilePictures/defaultUser.png`,
            contentType: 'image/png'
        }
    };

    const newUser = await User.create(user);

    const token = returnToken(newUser);
    return token;
}

exports.login = async (username, password) => {
    const user = await User.findOne({ username });

    if (!user) {
        throw new Error('Username or password don\'t match!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Username or password don\'t match!');
    }

    const token = returnToken(user);
    return token;
};

exports.getUser = (username) => {
    return User.findOne({ username }).select('-password');
};

exports.follow = async (userToFollow, userId) => {
    const user = await User.findOne({ username: userToFollow });
    const userToFollowId = user._id;

    isFollowing = false;
    if (checkIfUserIsFollowing(user, userId)) {
        isFollowing = true;
    }

    let result;
    if (!isFollowing) {
        result = await Promise.all([
            User.findByIdAndUpdate(userToFollowId, { $push: { followers: userId } }, { new: true }).select('-password'),
            User.findByIdAndUpdate(userId, { $push: { following: userToFollowId } }, { new: true }).select('-password')
        ]);
    }
    if (isFollowing) {
        result = await Promise.all([
            User.findByIdAndUpdate(userToFollowId, { $pull: { followers: userId } }, { new: true }).select('-password'),
            User.findByIdAndUpdate(userId, { $pull: { following: userToFollowId } }, { new: true }).select('-password')
        ]);
    }
    return result[0];
};


async function returnToken(updatedUser){
    const payload = {
        _id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        birthdate: updatedUser.birthdate,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture
    };
    const token = await sign(payload, SECRET, { expiresIn: '1h' });
    return token;
};

function checkIfUserIsFollowing(user, userId) {
    return user.followers?.map(u => u.toString()).includes(userId);
};
