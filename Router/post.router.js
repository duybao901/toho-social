const express = require('express');
const router = express.Router();

const auth = require('../Middleware/auth');
const PostController = require('../Controller/post.controller');

router.post('/create_post', auth, PostController.createPost);

router.get('/post/:id', auth, PostController.getDetailPost);

router.get('/posts', auth, PostController.getPosts);

router.patch('/post/:id', auth, PostController.updatePost);

router.patch('/post/:id/like', auth, PostController.likePost);

router.patch('/post/:id/unlike', auth, PostController.unlikePost);

router.get('/user_posts/:id', auth, PostController.getUserPosts);

router.get('/post_discover', auth, PostController.getDiscoverPosts)

router.delete('/post/:id', auth, PostController.deletePost);

router.patch('/post/:id/save', auth, PostController.savePost);

router.patch('/post/:id/unsave', auth, PostController.unsavePost);

router.get('/get_saved_post', auth, PostController.getSavedPost);

module.exports = router;