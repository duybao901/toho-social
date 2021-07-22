const Comments = require('../Model/comment.model');
const Posts = require('../Model/post.model')

class CommentController {
    async createComment(req, res) {
        try {
            const { postId, content, tag, reply } = req.body;

            const newComment = new Comments({
                user: req.user._id, content, tag, reply
            })

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
}

module.exports = new CommentController();