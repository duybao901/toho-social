const Comments = require('../Model/comment.model');
const Posts = require('../Model/post.model')

class CommentController {
    async createComment(req, res) {
        try {
            const { postId, content, tag, reply, postUserId } = req.body;

            const newComment = new Comments({
                user: req.user._id, content, tag, reply, postUserId, postId
            })

            const post = await Posts.findById(postId);
            if (!post) {
                return res.status(400).json({ msg: "This post is not exist." })
            }

            if (reply) {
                const cm = await Comments.findById(reply);
                if (!cm) {
                    return res.status(400).json({ msg: "This post is not exist." })
                }
            }

            await Posts.findOneAndUpdate({ _id: postId }, {
                $push: {
                    comments: newComment._id
                }
            })

            await newComment.save();

            res.json({ msg: "Create comment", newComment });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async updateComment(req, res) {
        try {
            const { content } = req.body;
            await Comments.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { content });

            res.json({ msg: "Update comment success" });

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async likeComment(req, res) {
        try {
            const comment = await Comments.findOne({ _id: req.params.id, likes: req.user._id });

            if (comment && comment.length > 0) {
                return res.status(400).json({ msg: "You liked this comment." })
            }

            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $push: {
                    likes: req.user._id
                }
            }, { new: true })
            return res.json({ msg: "Like comment" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async unlikeComment(req, res) {
        try {
            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $pull: {
                    likes: req.user._id
                }
            }, { new: true })
            return res.json({ msg: "unLike comment" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async deleteComment(req, res) {
        try {
            // 2 nguoi co the xoa: 1. nguoi tao post, 2 nguoi comment trong bai post 
            // Xoa comment trong modal comment theo user_id or postuserId
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    { user: req.user._id },
                    { postUserId: req.user._id }
                ]
            })

            await Posts.findOneAndUpdate({ _id: comment.postId }, {
                $pull: { comments: req.params.id }
            })

            res.json({ msg: 'Deleted Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = new CommentController();