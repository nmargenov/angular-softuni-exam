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
}

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
}