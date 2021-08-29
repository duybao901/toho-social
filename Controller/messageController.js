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
            const { sender, recipient, text, media, call } = req.body;

            if (!recipient || (!text.trim() && media.length === 0) && !call) return;

            const newConversation = await Conversations.findOneAndUpdate(
                {
                    $or: [
                        { recipients: [sender, recipient] },
                        { recipients: [recipient, sender] }
                    ]
                },
                {
                    recipients: [sender, recipient],
                    text,
                    media,
                    call
                }, { new: true, upsert: true }
            )

            const newMessage = new Messages({
                conversation: newConversation._id,
                sender,
                recipient,
                text,
                media,
                call: { ...call }
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

    async deleteConversation(req, res) {
        try {
            const newConversation = await Conversations.findOneAndDelete({
                $or: [
                    { recipients: [req.user._id, req.params.id] },
                    { recipients: [req.params.id, req.user._id] }
                ]
            })

            await Messages.deleteMany({ conversation: newConversation._id });

            return res.json({ msg: "Delete Success!" });

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    }
}

module.exports = new MessageController();