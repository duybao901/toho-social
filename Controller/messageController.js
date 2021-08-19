const Conversations = require('../Model/conversationModel');
const Messages = require('../Model/messageModel');

class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }

}

class MessageController {
    async createMessage(req, res) {
        try {
            const { recipient, text, media } = req.body;

            if (!recipient || (!text.trim() && media.length === 0)) return;

            const newConversation = await Conversations.findOneAndUpdate(
                {
                    $or: [
                        { recipients: [req.user._id, recipient] },
                        { recipients: [recipient, req.user._id] }
                    ]
                },
                {
                    recipients: [req.user._id, recipient],
                    text,
                    media
                }, { new: true, upsert: true }
            )

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender: req.user._id,
                recipient,
                text, media
            })

            await newMessage.save();

            return res.json({ msg: "create message" });

        } catch (err) {
            return res.stats(500).json({ msg: err.message });
        }
    }

    async getConversation(req, res) {
        try {
            const feature = new ApiFeatures(Conversations.find({
                recipients: req.user._id
            }), req.query).pagination();

            const conversation = await feature.query.sort("-updatedAt")
                .populate("recipients", "avatar username fullname");

            return res.json({
                conversation,
                result: conversation.length
            });
        } catch (err) {
            return res.stats(500).json({ msg: err.message });
        }
    }

    async getMessage(req, res) {
        try {
            const feature = new ApiFeatures(Messages.find({
                $or: [
                    { sender: req.user._id, recipient: req.params.id },
                    { sender: req.params.id, recipient: req.user._id },
                ]
            }), req.query).pagination();

            const messages = await feature.query.sort("-createdAt");

            return res.json({
                messages,
                result: messages.length
            });
        } catch (err) {
            return res.stats(500).json({ msg: err.message });
        }
    }
    async deleteMessage(req, res) {
        try {

            await Messages.findOneAndDelete({ _id: req.params.id, sender: req.user._id });

            return res.json({
                msg: "Delete message!"
            });
        } catch (err) {
            return res.stats(500).json({ msg: err.message });
        }
    }
}

module.exports = new MessageController();