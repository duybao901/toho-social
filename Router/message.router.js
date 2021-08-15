const express = require('express');
const router = express.Router();

const MessageController = require('../Controller/messageController');
const auth = require('../Middleware/auth');

router.post('/message', auth, MessageController.createMessage);

router.get('/conversation', auth, MessageController.getConversation);

router.get('/message/:id', auth, MessageController.getMessage);



module.exports = router;