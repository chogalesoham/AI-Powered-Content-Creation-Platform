#!/usr/bin/env node

/**
 * Test Setup Script for AI-Powered Content Creation Platform
 * This script validates that all components are properly configured
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5173';

console.log('🚀 Testing AI-Powered Content Creation Platform Setup\n');

// Test 1: Check if required files exist
console.log('📁 Checking project structure...');
const requiredFiles = [
    'backend/server.js',
    'backend/package.json',
    'backend/.env',
    'frontend/package.json',
    'frontend/src/App.tsx',
    'AIML/index.js',
    'README.md'
];

let filesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - Missing`);
        filesExist = false;
    }
});

if (!filesExist) {
    console.log('\n❌ Some required files are missing. Please check the project structure.');
    process.exit(1);
}

console.log('\n✅ All required files found!\n');

// Test 2: Check backend health
async function testBackend() {
    console.log('🔧 Testing backend connection...');
    try {
        const response = await axios.get(`${BACKEND_URL}/`, { timeout: 5000 });
        if (response.status === 200) {
            console.log('✅ Backend server is running');
            return true;
        }
    } catch (error) {
        console.log('❌ Backend server is not responding');
        console.log('   Make sure to run: cd backend && npm run dev');
        return false;
    }
}

// Test 3: Test AI health endpoint
async function testAI() {
    console.log('🤖 Testing AI services...');
    try {
        const response = await axios.get(`${BACKEND_URL}/api/ai/health`, { timeout: 5000 });
        if (response.data.success) {
            console.log('✅ AI services are initialized');
            console.log(`   Status: ${response.data.status}`);
            if (response.data.checks.openai) {
                console.log('✅ OpenAI integration is working');
            } else {
                console.log('⚠️  OpenAI integration is not configured (features will be limited)');
                console.log('   Add your OpenAI API key to backend/.env');
            }
            return true;
        }
    } catch (error) {
        console.log('❌ AI services are not responding');
        return false;
    }
}

// Test 4: Test demo account
async function testDemoAccount() {
    console.log('👤 Testing demo account...');
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            email: 'demo@contentai.com',
            password: 'demo123'
        }, { timeout: 5000 });
        
        if (response.data.success) {
            console.log('✅ Demo account is working');
            console.log(`   User: ${response.data.user.name}`);
            console.log(`   Company: ${response.data.user.company}`);
            return true;
        }
    } catch (error) {
        console.log('❌ Demo account login failed');
        return false;
    }
}

// Test 5: Check frontend (if running)
async function testFrontend() {
    console.log('🎨 Testing frontend connection...');
    try {
        const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
        if (response.status === 200) {
            console.log('✅ Frontend is running');
            return true;
        }
    } catch (error) {
        console.log('⚠️  Frontend is not running');
        console.log('   To start: cd frontend && npm run dev');
        return false;
    }
}

// Run all tests
async function runTests() {
    const backendOk = await testBackend();
    
    if (backendOk) {
        await testAI();
        await testDemoAccount();
    }
    
    await testFrontend();
    
    console.log('\n📋 Setup Summary:');
    console.log('==================');
    console.log('✅ Project structure is correct');
    console.log(backendOk ? '✅ Backend is running' : '❌ Backend needs to be started');
    console.log('⚠️  AI features require OpenAI API key in backend/.env');
    console.log('🎯 Demo account: demo@contentai.com / demo123');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start frontend: cd frontend && npm run dev');
    console.log('3. Visit http://localhost:5173');
    console.log('4. Login with demo account or create new account');
    console.log('5. Add OpenAI API key to backend/.env for full AI features');
    
    console.log('\n✨ Happy content creating!');
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
    console.error('\n❌ Test failed with error:', error.message);
    process.exit(1);
});

// Run the tests
runTests().catch(error => {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
});
