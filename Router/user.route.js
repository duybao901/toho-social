const express = require('express');
const router = express.Router();

const UserController = require('../Controller/user.controller');
const auth = require('../Middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/refresh_token', UserController.getAccessToken);

router.get('/search', auth, UserController.searchUsers);
router.get('/user/:id', auth, UserController.getUser);

router.patch('/change_avatar', auth, UserController.changeAvatar);
router.patch('/change_background', auth, UserController.changeBackground);
router.put('/edit_profile', auth, UserController.editProfile);
module.exports = router;