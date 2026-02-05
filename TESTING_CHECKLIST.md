# 🧪 TESTING CHECKLIST

## Local Testing (Before Deployment)

### ✅ Step 1: Check Dev Server
- [ ] Dev server running without errors
- [ ] No console errors in terminal
- [ ] Frontend accessible at http://localhost:5173

### ✅ Step 2: Test Frontend
- [ ] Landing page loads
- [ ] Can login/register
- [ ] Dashboard displays
- [ ] Case library loads

### ✅ Step 3: Test Core Features
- [ ] Can enter courtroom
- [ ] Video/audio permissions work
- [ ] Can send messages in chat
- [ ] Timer controls work (if judge)

### ✅ Step 4: Test AI Features (CRITICAL!)
- [ ] Type an argument in courtroom
- [ ] Click "AI Feedback" button
- [ ] AI panel shows with feedback
- [ ] Score displays (should work even without API key!)
- [ ] No errors in console

### ✅ Step 5: Test Session Recordings
- [ ] Recording auto-starts when entering courtroom
- [ ] Can stop recording
- [ ] Recording appears in "Session Recordings" page
- [ ] Can play back recording
- [ ] Transcript displays

---

## Production Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "Fix production URLs and add real Gemini AI integration

- Fixed all hardcoded localhost URLs to use environment variables
- Integrated Google Gemini AI for real argument analysis
- Added intelligent fallback for when API key not set
- Updated 6 frontend files for production compatibility
- Created comprehensive AI service with error handling"
git push
```

### Step 2: Verify GitHub Push
- [ ] Go to GitHub repository
- [ ] Verify latest commit shows up
- [ ] Check that all files are updated

### Step 3: Render Deployment
Backend should auto-deploy when you push to GitHub!

- [ ] Go to Render dashboard
- [ ] Check Backend service status
- [ ] Wait for "Deploy succeeded" message
- [ ] Check logs for "Gemini AI initialized" or "No GEMINI_API_KEY found"

### Step 4: Add Gemini API Key (Optional)
If you want real AI (recommended):

1. Get API key from https://ai.google.dev/
2. Render Dashboard → Backend Service
3. Environment tab → Add Environment Variable
4. Key: `GEMINI_API_KEY`
5. Value: Your API key
6. Save → Auto-redeploys

### Step 5: Test Production
- [ ] Visit https://moot-court-frontend.onrender.com
- [ ] Login/Register
- [ ] Enter courtroom
- [ ] Test AI feedback (should work!)
- [ ] Check browser console (no errors!)
- [ ] Test recording features

---

## Expected Results

### Without API Key:
✅ AI feedback works (intelligent fallback)
✅ Scoring based on argument quality
✅ Professional feedback
✅ No errors or crashes

### With API Key:
✅ Real Gemini AI analysis
✅ Highly personalized feedback
✅ Legal terminology recognition
✅ Context-aware suggestions

---

## Troubleshooting

### "Cannot read properties of undefined"
- Clear browser cache
- Do a hard refresh (Ctrl+Shift+R)
- Check browser console for specific error

### "Failed to fetch"
- Check that backend is deployed
- Verify VITE_API_URL in .env.production
- Check Render backend logs

### "AI not working"
- Check browser console
- Should show fallback message if no API key
- Verify backend logs show AI initialization

### Backend not deploying
- Check Render dashboard for errors
- Verify package.json has all dependencies
- Check server logs for startup errors

---

## Success Criteria

After deployment, your app should:
✅ Load without errors on production URL
✅ Allow user registration/login
✅ Display case library
✅ Start courtroom sessions with video/audio
✅ Provide AI feedback (fallback or real)
✅ Record and save session data
✅ Display leaderboard
✅ Work on mobile devices

---

## Notes

- First load may take 30 seconds (free tier spin-up)
- Test both with and without API key
- Monitor Render logs for any issues
- Keep browser console open for errors

---

**Once all checkboxes are ✅, you're production-ready!** 🚀
