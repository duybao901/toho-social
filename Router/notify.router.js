const express = require("express");
const router = express.Router();

const auth = require('../Middleware/auth')
const NotifyController = require('../Controller/notify.controller');

router.post('/notify', auth, NotifyController.createNotify);
router.delete('/notify/:id', auth, NotifyController.deleteNotify);
router.get('/notifies', auth, NotifyController.getNotifies);
router.patch('/notify_read/:id', auth, NotifyController.isReadNotify);
router.delete('/delete_notifies', auth, NotifyController.deleteAllNotify);



module.exports = router;