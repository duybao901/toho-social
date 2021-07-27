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

    async getPosts(req, res) {
        try {
            let posts = await Posts.find({ user: [...req.user.followings, req.user._id] })
                .sort("-createdAt")
                .populate("user likes", "user username email fullname avatar followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    },
                })

            return res.json({
                msg: "Success!",
                result: posts.length,
                posts
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async updatePost(req, res) {
        try {
            const { content, images } = req.body;

            const post = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                content, images
            }).populate("user likes", "user username email fullname avatar followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    },
                })

            return res.json({
                msg: "Update post",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async likePost(req, res) {
        try {
            const post = await Posts.findOne({ _id: req.params.id, likes: req.user._id });

            if (post && post.length > 0) {
                return res.status(400).json({ msg: "You liked this post." })
            }

            await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    likes: req.user._id
                }
            }, { new: true })
            return res.json({ msg: "Like post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async unlikePost(req, res) {
        try {
            await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    likes: req.user._id
                }
            }, { new: true })
            return res.json({ msg: "unLike post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getUserPosts(req, res) {
        try {
            const posts = await Posts.find({ user: req.params.id }).sort("-createdAt")

            return res.json({
                posts,
                result: posts.length
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getDetailPost(req, res) {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "user username email fullname avatar followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    },
                })

            return res.json({
                post
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

module.exports = new PostController;