const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth');
const PostController = require('../Controller/post.controller');

router.post('/create_post', auth, PostController.createPost);

module.exports = router;