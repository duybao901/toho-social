const Notifies = require("../Model/notify.model");

class NotifyController {
    async createNotify(req, res) {
        try {
            const { id, recipients, url, text, content, image } = req.body;

            const notify = new Notifies({
                id, user: req.user._id, recipients, url, text, content, image
            })

            await notify.save();

            return res.json({ msg: "create notify", notify })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async deleteNotify(req, res) {
        try {

            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })

            return res.json({ notify })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

    async getNotifies(req, res) {
        try {
            const notify = await Notifies.find({ recipients: req.user._id })
                .sort('-createdAt').populate('user', 'avatar username')
            return res.json({ notify });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    async isReadNotify(req, res) {
        try {

            const notify = await Notifies.findOneAndUpdate({ _id: req.params.id }, {
                isRead: true
            });
            return res.json({ msg: "Read notify", notify });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    async deleteAllNotify(req, res) {
        try {
            let notifies = await Notifies.deleteMany({ recipients: req.user._id });

            return res.json({ notifies });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = new NotifyController;