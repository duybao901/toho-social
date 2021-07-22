const express = require('express');
const router = express.Router();

const commentController = require('../Controller/comment.controller');
const auth = require('../Middleware/auth')

router.post('/comment', auth, commentController.createComment);

router.patch('/comment/:id', auth, commentController.updateComment)

router.patch('/comment/:id/like', auth, commentController.likeComment)

router.patch('/comment/:id/unlike', auth, commentController.unlikeComment)

module.exports = router;