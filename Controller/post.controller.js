const Posts = require('../Model/post.model')

class PostController {
    async createPost(req, res) {
        try {
            const { content, images } = req.body;
            const newPost = new Posts({
                content, images, user: req.user._id,
            })

            await newPost.save();

            res.json({
                msg: "Create post",
                newPost
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = new PostController;