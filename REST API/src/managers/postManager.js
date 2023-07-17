const Post = require("../models/Post");

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