#!/usr/bin/env node

/**
 * Test Database Integration Script
 * This script tests the database models and API endpoints
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';

async function testDatabaseIntegration() {
    console.log('🧪 Testing Database Integration\n');

    try {
        // Test 1: Login with demo account
        console.log('1. Testing authentication...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: 'demo@contentai.com',
            password: 'demo123'
        });

        if (loginResponse.data.success) {
            authToken = loginResponse.data.token;
            console.log('✅ Authentication successful');
        } else {
            throw new Error('Authentication failed');
        }

        // Test 2: Create a content draft
        console.log('2. Testing content draft creation...');
        const draftResponse = await axios.post(`${API_BASE}/content/drafts`, {
            title: 'Test LinkedIn Post',
            platform: 'LinkedIn',
            content: 'This is a test post created by the database integration test. #testing #ai #content',
            contentType: 'Personal',
            tags: ['test', 'automation']
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (draftResponse.data.success) {
            console.log('✅ Content draft created successfully');
            console.log(`   Draft ID: ${draftResponse.data.draft._id}`);
        } else {
            throw new Error('Failed to create content draft');
        }

        // Test 3: Create a scheduled post
        console.log('3. Testing scheduled post creation...');
        const scheduledDate = new Date();
        scheduledDate.setHours(scheduledDate.getHours() + 2); // Schedule for 2 hours from now

        const scheduleResponse = await axios.post(`${API_BASE}/schedule/posts`, {
            platform: 'Twitter',
            content: 'This is a test scheduled post! 🚀 #testing #automation',
            scheduledFor: scheduledDate.toISOString(),
            contentType: 'Personal'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (scheduleResponse.data.success) {
            console.log('✅ Scheduled post created successfully');
            console.log(`   Post ID: ${scheduleResponse.data.post._id}`);
            console.log(`   Scheduled for: ${new Date(scheduleResponse.data.post.scheduledFor).toLocaleString()}`);
        } else {
            throw new Error('Failed to create scheduled post');
        }

        // Test 4: Create a recurring schedule
        console.log('4. Testing recurring schedule creation...');
        const recurringResponse = await axios.post(`${API_BASE}/schedule/recurring`, {
            name: 'Weekly LinkedIn Thought Leadership',
            platform: 'LinkedIn',
            contentType: 'Thought Leadership',
            frequency: 'weekly',
            timeOfDay: '09:00',
            dayOfWeek: 1, // Monday
            contentPrompts: ['Share insights about industry trends', 'Discuss leadership challenges'],
            settings: {
                tone: 'professional',
                includeHashtags: true,
                contentLength: 'medium'
            }
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (recurringResponse.data.success) {
            console.log('✅ Recurring schedule created successfully');
            console.log(`   Schedule ID: ${recurringResponse.data.schedule._id}`);
            console.log(`   Next generation: ${new Date(recurringResponse.data.schedule.nextGeneration).toLocaleString()}`);
        } else {
            throw new Error('Failed to create recurring schedule');
        }

        // Test 5: Get content statistics
        console.log('5. Testing content statistics...');
        const statsResponse = await axios.get(`${API_BASE}/content/stats`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (statsResponse.data.success) {
            console.log('✅ Content statistics retrieved successfully');
            console.log(`   Drafts: ${JSON.stringify(statsResponse.data.stats.drafts)}`);
            console.log(`   Scheduled: ${JSON.stringify(statsResponse.data.stats.scheduled)}`);
        } else {
            throw new Error('Failed to get content statistics');
        }

        // Test 6: Test AI content generation
        console.log('6. Testing AI content generation...');
        const aiResponse = await axios.post(`${API_BASE}/content/generate`, {
            prompt: 'Create a post about the importance of testing in software development',
            platform: 'LinkedIn',
            contentType: 'Educational',
            saveAsDraft: true
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        if (aiResponse.data.success) {
            console.log('✅ AI content generation successful');
            console.log(`   Generated content length: ${aiResponse.data.content.length} characters`);
            if (aiResponse.data.draft) {
                console.log(`   Saved as draft ID: ${aiResponse.data.draft._id}`);
            }
        } else {
            console.log('⚠️  AI content generation failed (this is expected if OpenAI API key is not configured)');
            console.log(`   Error: ${aiResponse.data.error}`);
        }

        console.log('\n🎉 Database Integration Test Complete!');
        console.log('\n📊 Summary:');
        console.log('✅ Authentication working');
        console.log('✅ Content drafts saving to database');
        console.log('✅ Scheduled posts saving to database');
        console.log('✅ Recurring schedules saving to database');
        console.log('✅ Statistics calculation working');
        console.log('✅ Database integration is fully functional!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
testDatabaseIntegration().catch(error => {
    console.error('Test suite failed:', error.message);
    process.exit(1);
});
