const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const AIML = require('../../AIML');


router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching profile'
        });
    }
});

router.put('/profile', auth, async (req, res) => {
    try {
        const updateData = req.body;

        // If pastPosts are provided, analyze tone
        if (updateData.pastPosts && updateData.pastPosts.trim().length > 0) {
            try {
                const toneAnalysis = await AIML.analyzeTone(updateData.pastPosts);
                if (toneAnalysis.success) {
                    updateData.toneProfile = toneAnalysis.profile;
                    // Update tone if not explicitly set
                    if (!updateData.tone) {
                        updateData.tone = toneAnalysis.profile.primaryTone;
                    }
                }
            } catch (error) {
                console.error('Tone analysis error during profile update:', error);
                // Continue with profile update even if tone analysis fails
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating profile'
        });
    }
});


module.exports = router;