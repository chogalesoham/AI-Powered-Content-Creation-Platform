const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Error registering user'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user
        let user = await User.findOne({ email });

        // Create demo account if it doesn't exist
        if (!user && email === 'demo@contentai.com' && password === 'demo123') {
            const hashedPassword = await bcrypt.hash('demo123', 12);
            user = new User({
                name: 'Demo User',
                email: 'demo@contentai.com',
                password: hashedPassword,
                company: 'ContentAI Demo',
                role: 'founder',
                platforms: ['LinkedIn', 'Twitter'],
                niche: 'SaaS',
                tone: 'professional',
                goals: ['Brand Awareness', 'Thought Leadership'],
                toneProfile: {
                    primaryTone: 'professional',
                    styleElements: ['industry expertise', 'data-driven insights', 'structured content'],
                    voiceDescription: 'Professional and informative with industry expertise',
                    confidence: 0.85,
                    analysisMethod: 'default'
                }
            });
            await user.save();
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                company: user.company,
                role: user.role,
                platforms: user.platforms,
                niche: user.niche,
                tone: user.tone,
                goals: user.goals
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Error logging in'
        });
    }
});

module.exports = router;