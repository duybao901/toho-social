const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    background: {
        type: String,
        default: 'https://res.cloudinary.com/dxnfxl89q/image/upload/v1625327484/Toho/close-up-opened-umbrella-mockup_53876-98796_nj3un5.jpg'
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    role: {
        type: String,
        default: 'user'
    },
    gender: {
        type: String,
        default: 'male'
    },
    mobile: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    website: {
        type: String, default: ''
    },
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    followings: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ],
    saved: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        }
    ]
}, {
    timestamps: true,
})

module.exports = mongoose.model("user", userScheme);