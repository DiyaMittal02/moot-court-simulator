# ⚡ QUICK START - Deploy NOW in 3 Commands!

## 🎯 Deploy Your Moot Court Simulator (15 minutes)

### **Step 1: Push Your Code to GitHub** (2 minutes)

Open Command Prompt and run these 3 commands:

```cmd
cd C:\Users\lenovo\OneDrive\Desktop\new-moot-court
git add .
git commit -m "Production deployment - All UIs ready"
git push
```

✅ **Done!** Your code is now on GitHub.

---

### **Step 2: Deploy Backend to Render** (5 minutes)

1. **Open browser**: https://dashboard.render.com/
2. **Click**: "New +" → "Web Service"
3. **Copy/paste this config**:
   - Repository: `DiyaMittal02/moot-court-simulator`
   - Name: `moot-court-backend`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Instance Type: **Free**
4. **Click**: "Create Web Service"
5. **Wait**: ~5 minutes ⏳
6. **Copy URL**: `https://moot-court-backend-XXXX.onrender.com`

✅ **Test it**: Visit `[your-backend-url]/api/case-library` → Should show 10 cases!

---

### **Step 3: Deploy Frontend to Render** (5 minutes)

1. **Click**: "New +" → "Static Site"
2. **Copy/paste this config**:
   - Repository: `DiyaMittal02/moot-court-simulator`
   - Name: `moot-court-frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `[paste your backend URL from Step 2]`
4. **Click**: "Create Static Site"
5. **Wait**: ~5 minutes ⏳

✅ **YOUR APP IS LIVE!** 🎉

---

## 🌐 Access Your Live App

**Frontend**: https://moot-court-frontend.onrender.com

**Backend**: https://moot-court-backend.onrender.com

---

## ✅ Verify Everything Works

Open your frontend URL and check:

1. ✅ **Login page** - Beautiful gradient, smooth animations
2. ✅ **Dashboard** - All sections visible
3. ✅ **Case Library** - 10 landmark cases display
4. ✅ **Create Case** - Form works correctly
5. ✅ **Courtroom** - Video/audio panels, chat working
6. ✅ **Session Recordings** - List displays properly
7. ✅ **Leaderboard** - Rankings show correctly

---

## 🚨 Common First-Time Issues

### **Issue: "Service Unavailable"**
**Solution**: Wait 30 seconds - free tier services sleep after inactivity. First request wakes them up!

### **Issue: "Cannot connect to backend"**
**Solution**: 
1. Check `VITE_API_URL` environment variable in Render dashboard
2. Ensure backend URL is correct (no trailing slash)
3. Test backend directly: `[backend-url]/api/case-library`

### **Issue: "CORS Error"**
**Solution**: Already configured! If you see this:
1. Check backend logs in Render dashboard
2. Verify frontend URL is in `server/index.js` CORS whitelist
3. Redeploy backend: Manual Deploy → Clear cache & deploy

---

## 🔄 Updating Your Live App

Made changes? Just run:

```cmd
git add .
git commit -m "Your change description"
git push
```

**Render automatically deploys in ~5 minutes!** No other steps needed.

---

## 📚 Need More Details?

- **Full Guide**: `COMPLETE_DEPLOYMENT_GUIDE.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST_INTERACTIVE.md`
- **Architecture**: `DEPLOYMENT_ARCHITECTURE.md`
- **Workflow**: `.agent/workflows/deploy.md`

---

## 🎉 That's It!

**3 steps. 15 minutes. Your app is LIVE worldwide!**

Everything works:
- ✅ All beautiful UIs
- ✅ Real-time courtrooms
- ✅ WebRTC video/audio
- ✅ Case library
- ✅ Session recordings
- ✅ Leaderboard
- ✅ AI coaching

**Share your app with the world! 🚀**

---

## 📞 Quick Links

- **Render Dashboard**: https://dashboard.render.com/
- **GitHub Repo**: https://github.com/DiyaMittal02/moot-court-simulator
- **Your Live App**: https://moot-court-frontend.onrender.com

---

**Made with ❤️ | Deployed on Render.com**
