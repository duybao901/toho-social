const Posts = require('../Model/post.model')
const Comments = require('../Model/comment.model')
const Users = require('../Model/user.model')
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
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
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
            const post = await Posts.find({ _id: req.params.id, likes: req.user._id });

            if (post.length > 0) {
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

            // const features = new Apifeatures(
            //     Posts.find(
            //         { user: { $nin: [...req.user.followings, req.user._id] } }),
            //     req.query)
            //     .paginating()

            // let posts = await features.query.sort("-createdAt")

            const newArr = [...req.user.followings, req.user._id]
            const num = req.query.num || 9;

            const posts = await Posts.aggregate([
                { $match: { user: { $nin: newArr } } },
                { $sample: { size: Number(num) } },// Chon ngau nhien num post

            ])
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

            res.json({
                msg: "Deleted post!",
                newPost: {
                    ...post._doc,
                    user: req.user
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async savePost(req, res) {
        try {
            const user = await Users.find({ _id: req.user._id, saved: req.params.id });

            if (user && user.length > 0) {
                return res.status(400).json({ msg: "You save this post." })
            }

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: {
                    saved: req.params.id
                }
            }, { new: true })

            if (!save) {
                return res.status(400).json({ msg: "This post is not exist." })
            }

            return res.json({ msg: "Saved post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async unsavePost(req, res) {
        try {

            const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: {
                    saved: req.params.id
                }
            }, { new: true })

            if (!save) {
                return res.status(400).json({ msg: "This post is not exist." })
            }

            return res.json({ msg: "UnSaved post" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getSavedPost(req, res) {
        try {
            const features = new Apifeatures(Posts.find({
                _id: { $in: req.user.saved }
            }), req.query).paginating();

            const savePosts = await features.query.sort("-createdAt");

            return res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

module.exports = new PostController;