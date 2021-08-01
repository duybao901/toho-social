const Posts = require('../Model/post.model')
const Comments = require('../Model/comment.model')
class Apifeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

}
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

            const features = new Apifeatures(Posts.find({ user: [...req.user.followings, req.user._id] }), req.query).paginating()

            let posts = await features.query.sort("-createdAt")
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

            const like = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    likes: req.user._id
                }
            }, { new: true })

            if (!like) {
                return res.status(400).json({ msg: "This post is not exist." })
            }

            return res.json({ msg: "Like post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async unlikePost(req, res) {
        try {
            const unlike = await Posts.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    likes: req.user._id
                }
            }, { new: true })

            if (!unlike) {
                return res.status(400).json({ msg: "This post is not exist." })
            }
            return res.json({ msg: "unLike post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getUserPosts(req, res) {
        try {
            const feature = new Apifeatures(Posts.find({ user: req.params.id }), req.query).paginating()
            const posts = await feature.query.sort("-createdAt")

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

    async getDiscoverPosts(req, res) {
        try {

            const features = new Apifeatures(
                Posts.find(
                    { user: { $nin: [...req.user.followings, req.user._id] } }),
                req.query)
                .paginating()

            let posts = await features.query.sort("-createdAt")

            return res.json({
                msg: "Success!",
                result: posts.length,
                posts
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async deletePost(req, res) {
        try {
            const post = await Posts.findOneAndDelete({ _id: req.params.id, user: req.user._id });

            await Comments.deleteMany({ _id: { $in: post.comments } });

            res.json({ msg: "Deleted post!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

module.exports = new PostController;