# 🚀 COMPLETE DEPLOYMENT FIX

## ❌ Current Problem
Your app is deployed but not working because:
1. Frontend can't connect to backend (backend not deployed yet)
2. Environment variables not set

## ✅ SOLUTION - Follow These Exact Steps

### **STEP 1: Deploy Backend First (Render)**

1. **Go to**: https://dashboard.render.com/
2. **Click**: "New +" → "Web Service"
3. **Connect GitHub**: Select `DiyaMittal02/moot-court-simulator`
4. **Configure**:
   ```
   Name: moot-court-server
   Environment: Node
   Branch: main
   Root Directory: (leave blank)
   Build Command: npm install
   Start Command: node server/index.js
   Instance Type: Free
   ```
5. **Click**: "Create Web Service"
6. **WAIT 5 MINUTES** for deployment
7. **COPY THE URL**: It will look like `https://moot-court-server-xxxx.onrender.com`

---

### **STEP 2: Update Vercel Environment Variables**

1. **Go to**: https://vercel.com/diyamittal02s-projects/moot-court-simulator/settings/environment-variables
2. **Add New Variable**:
   ```
   Name: VITE_API_URL
   Value: https://moot-court-server-xxxx.onrender.com
   (Use the URL you copied from Render)
   Environment: Production, Preview, Development (check all 3)
   ```
3. **Click**: "Save"

---

### **STEP 3: Redeploy Vercel**

1. **Go to**: https://vercel.com/diyamittal02s-projects/moot-court-simulator/deployments
2. **Find latest deployment** → Click "..." → "Redeploy"
3. **Check**: "Use existing Build Cache" (uncheck it)
4. **Click**: "Redeploy"
5. **WAIT 2 MINUTES**

---

### **STEP 4: Test Your App**

Visit: **https://moot-court-simulator-git-main-diyamittal02s-projects.vercel.app**

**What should work:**
- ✅ Login page loads with proper styling
- ✅ Can login and see dashboard
- ✅ Case Library shows 10 cases
- ✅ Session Recordings shows 3 recordings
- ✅ Can create new case
- ✅ Can enter courtroom
- ✅ Recording works

---

## 🔧 ALTERNATIVE: Deploy Everything to Render

If Vercel is giving you trouble, deploy BOTH frontend and backend to Render:

### **Option A: Static Site on Render**

1. **New** → "Static Site"
2. **Connect**: `DiyaMittal02/moot-court-simulator`
3. **Configure**:
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```
4. **Environment Variables**:
   ```
   VITE_API_URL = https://moot-court-server-xxxx.onrender.com
   ```

---

## 📝 Quick Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Environment variable added to Vercel
- [ ] Vercel redeployed
- [ ] App tested and working

---

## 🆘 If Still Not Working

### **Check Backend is Running:**
Visit: `https://your-backend-url.onrender.com/api/case-library`

You should see JSON data with 10 cases.

### **Check Frontend Console:**
1. Open your live site
2. Press F12
3. Go to Console tab
4. Look for errors

**Common errors:**
- `Failed to fetch` = Backend not deployed or wrong URL
- `CORS error` = Backend CORS not configured (already fixed)
- `404` = Wrong API endpoint

---

## 🎯 The Correct URLs

After deployment:
- **Frontend**: `https://moot-court-simulator-git-main-diyamittal02s-projects.vercel.app`
- **Backend**: `https://moot-court-server-xxxx.onrender.com`
- **API Test**: `https://moot-court-server-xxxx.onrender.com/api/case-library`

---

## ⚡ FASTEST FIX

**Just deploy the backend to Render RIGHT NOW:**

1. Go to https://dashboard.render.com/
2. New Web Service
3. Connect your GitHub repo
4. Use these settings:
   - Build: `npm install`
   - Start: `node server/index.js`
5. Deploy!

**That's it!** Once backend is live, copy the URL and add it to Vercel environment variables.

Your app will work perfectly! 🚀
