const Users = require('../Model/user.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
    async register(req, res) {
        try {
            const { fullname, username, email, password, gender } = req.body;
            let newUserName = username.toLowerCase().replace(/ /g, '');

            const user_name = await Users.findOne({ username: newUserName })
            if (user_name) return res.status(400).json({ msg: "This user name already exists." })

            const user_email = await Users.findOne({ email })
            if (user_email) return res.status(400).json({ msg: "This email already exists." })

            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters." })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                fullname, username: newUserName, email, password: passwordHash, gender
            })

            const access_token = createAccessToken({ id: newUser._id })
            const refresh_token = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
            })

            await newUser.save();

            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
                .populate("followers followings", "username avatar fullname followers followings")

            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

            const access_token = createAccessToken({ id: user._id })
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: "Logged out!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async getAccessToken(req, res) {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Please login now." })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err) return res.status(400).json({ msg: "Please login now." })

                const user = await Users.findById(result.id).select("-password")
                    .populate('followers followings', 'username avatar fullname followers followings')

                if (!user) return res.status(400).json({ msg: "This does not exist." })

                const access_token = createAccessToken({ id: result.id })

                res.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
    async searchUsers(req, res) {
        try {
            const users = await Users.find({ username: { $regex: req.query.username } })
                .limit(10).select("fullname username avatar");
            res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async getUser(req, res) {
        try {
            const user = await Users.findById(req.params.id)
                .populate("followers followings", "-password")
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json({ user })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async changeAvatar(req, res) {
        try {
            const { avatar } = req.body;
            await Users.findByIdAndUpdate(req.user._id, {
                avatar
            })
            res.json({ msg: "Change avatar success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async changeBackground(req, res) {
        try {
            const { background } = req.body;
            await Users.findByIdAndUpdate(req.user._id, {
                background
            })
            res.json({ msg: "Change background success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async editProfile(req, res) {
        try {
            const { fullname, mobile, address, story, website, gender } = req.body
            await Users.findByIdAndUpdate(req.user._id, {
                fullname, mobile, address, story, website, gender
            })
            return res.json({ msg: "Edit profile success." });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async follow(req, res) {
        try {

            const user = await Users.find({ _id: req.params._id, followers: req.user._id });
            if (user.length > 0) {
                return res.status(400).json({ msg: "You follwed this user." });
            }


            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $push: { followers: req.user._id }
            }, { new: true }).populate("followers followings", "-password")

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $push: { followings: req.params.id }
            }, { new: true })

            res.json({ newUser })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async unfollow(req, res) {
        try {
            const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { followers: req.user._id }
            }, { new: true }).populate("followers followings", "-password")

            await Users.findOneAndUpdate({ _id: req.user._id }, {
                $pull: { followings: req.params.id }
            }, { new: true })

            res.json({ newUser })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
    async suggestionUser(req, res) {
        try {
            const newArr = [...req.user.followings, req.user._id]
            const num = req.query.num || 8;

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },// Chon ngau nhien 10 user
                {
                    $lookup: {
                        from: "users",
                        localField: "followers",
                        foreignField: "_id",
                        as: "followers"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "followings",
                        foreignField: "_id",
                        as: "followings"
                    }
                }
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }

}

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}

module.exports = new UserController();