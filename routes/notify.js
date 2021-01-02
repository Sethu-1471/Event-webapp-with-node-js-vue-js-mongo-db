const express = require('express')
const router = express.Router()
// VAPID keys should only be generated only once.
const webPush = require('web-push');

router.post('/subscribe', (req, res) => {
    const subscription = [];
    subscription.push(req.body)
    res.status(201).json({});
      const payload = JSON.stringify({
        title: 'Push notifications is activated',
      });

      webPush.sendNotification(subscription[0], payload)
        .catch(error => console.error(error));
});

module.exports = router;