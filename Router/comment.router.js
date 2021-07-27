const express = require('express');
const router = express.Router();

const CommentController = require('../Controller/comment.controller');
const auth = require('../Middleware/auth')

router.post('/comment', auth, CommentController.createComment);

router.patch('/comment/:id', auth, CommentController.updateComment)

router.patch('/comment/:id/like', auth, CommentController.likeComment)

router.patch('/comment/:id/unlike', auth, CommentController.unlikeComment)

router.delete('/comment/:id', auth, CommentController.deleteComment)
module.exports = router;