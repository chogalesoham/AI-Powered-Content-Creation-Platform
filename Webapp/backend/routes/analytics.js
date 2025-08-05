const express = require('express');
const router = express.Router();
const Content = require('../models/content');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const content = await Content.find({ userId: req.user.userId });
        // Perform analytics on the content
        res.json({ message: 'Analytics data' });
    } catch (error) {
        res.status(500).send('Error fetching analytics');
    }
});

module.exports = router;