# 🚀 DEPLOYMENT CHECKLIST

## ✅ Pre-Deployment Checklist

- [x] All features implemented
  - [x] Case Library (10 landmark cases)
  - [x] Session Recording & Replay
  - [x] Live courtroom sessions
  - [x] AI feedback system
  - [x] Leaderboard
  - [x] Timer controls

- [x] Files created for deployment
  - [x] `vercel.json`
  - [x] `.env.production`
  - [x] `.env.development`
  - [x] `src/config/api.js`
  - [x] `.gitignore`

- [ ] **TODO: Update CORS in `server/index.js`**
  - Add your Vercel domain to allowed origins

- [ ] **TODO: Test build locally** (use Command Prompt):
  ```cmd
  npm run build
  ```

---

## 🎯 DEPLOYMENT STEPS

### **Method 1: GitHub → Vercel + Render (Recommended)**

#### Step 1: Push to GitHub
```cmd
git init
git add .
git commit -m "Moot Court Simulator - Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/moot-court-simulator.git
git push -u origin main
```

#### Step 2: Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework: Vite
4. Deploy

#### Step 3: Deploy Backend (Render)
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repository
4. Start command: `node server/index.js`
5. Deploy

#### Step 4: Connect Them
1. Copy Render backend URL
2. Update Vercel environment variable `VITE_API_URL`
3. Redeploy

---

### **Method 2: Vercel CLI (Fastest)**

```cmd
npm install -g vercel
vercel login
cd C:\Users\lenovo\OneDrive\Desktop\new-moot-court
vercel --prod
```

---

## 📊 Post-Deployment Testing

Test these URLs after deployment:

### Frontend Tests:
- [ ] Homepage loads
- [ ] Dashboard displays
- [ ] Case Library shows 10 cases
- [ ] Session Recordings page works
- [ ] Can create new case

### Backend Tests:
- [ ] `https://your-backend.onrender.com/api/case-library`
- [ ] `https://your-backend.onrender.com/api/recordings`
- [ ] `https://your-backend.onrender.com/api/leaderboard`

### Integration Tests:
- [ ] Frontend connects to backend
- [ ] Can enter courtroom
- [ ] Recording starts automatically
- [ ] Can stop and save recording
- [ ] Recording appears in list

---

## 🔧 If Something Breaks

### Frontend Issues:
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Verify environment variables

### Backend Issues:
1. Check Render logs
2. Test API endpoints directly
3. Verify CORS settings

### Connection Issues:
1. Verify `VITE_API_URL` is correct
2. Check CORS allows your frontend domain
3. Ensure both services are running

---

## 🎉 Success Criteria

Your app is successfully deployed when:
- ✅ Frontend loads at Vercel URL
- ✅ Backend responds at Render URL
- ✅ Case Library displays all cases
- ✅ Can create and enter courtroom
- ✅ Recording feature works
- ✅ All data persists

---

## 📱 Share Your App!

Once deployed, share:
- **Live URL**: `https://moot-court-simulator.vercel.app`
- **GitHub**: `https://github.com/YOUR_USERNAME/moot-court-simulator`

---

**Ready to deploy? Follow the steps in `DEPLOY_NOW.md`!** 🚀
