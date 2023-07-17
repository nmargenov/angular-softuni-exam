const Post = require("../models/Post");
const User = require("../models/User");

exports.getAllPosts = async (userId) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate({
        path: 'owner',
        select: '-password'
    });
    if(!userId){
       return posts;
    }else{
        const user = await User.findById(userId);
        const filteredPosts = posts.filter(p=>user.following.includes(p.owner._id));
        return filteredPosts;
    }
};

exports.createPost = (description, owner, image) => {
    const post = {
        description,
        owner,
    };
    if (image) {
        post.image = {
            data: image,
            contentType: 'image/png'
        }
    }
    return Post.create(post);
};

exports.getPostById = (postId) => {
    return Post.findById(postId).populate({
        path: 'owner',
        select: '-password'
    }).populate({
        path: 'comments',
        populate: {
            path: 'owner',
            select: '-password'
        }
    });
};


exports.likePost = async (postId, userId) => {
    const post = await Post.findById(postId);

    if (checkIfLiked(post, userId)) {
        return Post.findByIdAndUpdate(postId, { $pull: { likedBy: userId } }, { runValidators: true, new: true })
            .populate({ path: 'owner', select: '-password' })
            .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
    } else {
        return Post.findByIdAndUpdate(postId, { $push: { likedBy: userId } }, { new: true })
            .populate({ path: 'owner', select: '-password' })
            .populate({ path: 'comments', populate: { path: 'owner', select: '-password' } });
    }
};

function checkIfLiked(post, userId) {
    return post.likedBy.map(p => p.toString()).includes(userId);
};