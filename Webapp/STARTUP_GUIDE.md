# 🚀 Quick Start Guide

## ❌ Getting Login/Signup Errors?

If you're seeing "400 Bad Request" errors on login/signup, the backend server is not running.

### ✅ **Solution:**

1. **Open a terminal in the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if not done already):**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

4. **Wait for this message:**
   ```
   Server running on port 5000
   Connected to MongoDB
   ✅ AIML services ready
   ```

5. **In another terminal, start the frontend:**
   ```bash
   cd frontend
   npm install  # if not done already
   npm run dev
   ```

6. **Visit http://localhost:5173**

---

## 🎯 **Demo Account**
- **Email:** demo@contentai.com
- **Password:** demo123

---

## 🔧 **Troubleshooting**

### Backend won't start?
- Make sure you have Node.js installed
- Check if port 5000 is available
- Verify MongoDB connection in `backend/.env`

### Frontend shows connection errors?
- Make sure backend is running on port 5000
- Check browser console for detailed errors
- Try refreshing the page after backend starts

### AI features not working?
- Add your OpenAI API key to `backend/.env`:
  ```
  OPENAI_API_KEY=your-api-key-here
  ```

---

## 📱 **Features to Try**

1. **Login** with demo account
2. **Complete onboarding** to set up your profile
3. **Chat with AI** to generate content
4. **Browse templates** for inspiration
5. **Schedule content** for automated generation
6. **Customize settings** for your brand voice

---

## 🆘 **Still Having Issues?**

1. Check that both servers are running:
   - Backend: http://localhost:5000 (should show "Backend server is running!")
   - Frontend: http://localhost:5173 (should show the login page)

2. Check browser console for errors (F12 → Console)

3. Restart both servers:
   ```bash
   # Stop with Ctrl+C, then restart
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

---

## 🎉 **You're All Set!**

Once both servers are running, you can:
- Create an account or use the demo
- Generate AI-powered content
- Schedule posts for LinkedIn and Twitter
- Analyze your writing tone
- Use proven templates

Happy content creating! ✨
