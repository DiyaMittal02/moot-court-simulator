# 🚀 LIVE DEPLOYMENT - Step by Step Guide

## ⚠️ PowerShell Script Execution Issue

Your system has PowerShell script execution disabled. Here are your options:

### **Option 1: Enable PowerShell Scripts (Recommended)**
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then you can use npm commands normally.

---

### **Option 2: Use Command Prompt Instead**
Open **Command Prompt** (not PowerShell) and run:
```cmd
cd C:\Users\lenovo\OneDrive\Desktop\new-moot-court
npm run build
```

---

### **Option 3: Deploy Directly from GitHub (Easiest!)**

This is the EASIEST way - no local build needed!

#### **Step 1: Push to GitHub**

1. **Initialize Git** (if not already done):
   ```cmd
   cd C:\Users\lenovo\OneDrive\Desktop\new-moot-court
   git init
   git add .
   git commit -m "Initial commit - Moot Court Simulator"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New Repository"
   - Name: `moot-court-simulator`
   - Click "Create repository"

3. **Push Code**:
   ```cmd
   git remote add origin https://github.com/YOUR_USERNAME/moot-court-simulator.git
   git branch -M main
   git push -u origin main
   ```

#### **Step 2: Deploy Frontend to Vercel**

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import** your `moot-court-simulator` repository
5. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (we'll get this in Step 3)
7. **Click "Deploy"**

✅ **Frontend will be live in ~2 minutes!**

#### **Step 3: Deploy Backend to Render**

1. **Go to** [render.com](https://render.com)
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect** your GitHub repository
5. **Configure**:
   - Name: `moot-court-server`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Instance Type: **Free**
6. **Click "Create Web Service"**

✅ **Backend will be live in ~5 minutes!**

#### **Step 4: Connect Frontend to Backend**

1. **Copy your Render backend URL**: `https://moot-court-server-xxxx.onrender.com`
2. **Go back to Vercel**
3. **Settings** → **Environment Variables**
4. **Edit** `VITE_API_URL` to your Render URL
5. **Redeploy** (Vercel will auto-redeploy)

---

## 🎯 **FASTEST METHOD (No Git Required)**

### **Deploy Using Vercel CLI**

1. **Open Command Prompt** (not PowerShell)

2. **Install Vercel CLI**:
   ```cmd
   npm install -g vercel
   ```

3. **Login**:
   ```cmd
   vercel login
   ```

4. **Deploy**:
   ```cmd
   cd C:\Users\lenovo\OneDrive\Desktop\new-moot-court
   vercel
   ```

5. **Follow prompts**:
   - Setup and deploy? **Y**
   - Scope: Select your account
   - Link to existing project? **N**
   - Project name: `moot-court-simulator`
   - Directory: `./`
   - Override settings? **N**

6. **Production deploy**:
   ```cmd
   vercel --prod
   ```

✅ **Done! Your app is live!**

---

## 📦 **What You Need to Deploy**

### **Files Already Created:**
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env.production` - Production environment variables
- ✅ `.env.development` - Development environment variables
- ✅ `src/config/api.js` - API configuration utility

### **Your App Structure:**
```
moot-court/
├── src/              # Frontend React app
├── server/           # Backend Express server
├── data/             # JSON databases
├── public/           # Static assets
├── dist/             # Build output (created on build)
├── package.json      # Dependencies
└── vercel.json       # Vercel config
```

---

## 🌐 **After Deployment**

Your app will be live at:
- **Frontend**: `https://moot-court-simulator.vercel.app`
- **Backend**: `https://moot-court-server.onrender.com`

### **Test These Features:**
1. ✅ Case Library loads
2. ✅ Session Recordings display
3. ✅ Create new case
4. ✅ Enter courtroom
5. ✅ Recording works
6. ✅ WebRTC video/audio

---

## 🔧 **Update Server CORS for Production**

Before deploying, update `server/index.js` line 49:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://moot-court-simulator.vercel.app',
        'https://moot-court-simulator-*.vercel.app' // Preview deployments
    ],
    credentials: true
}));
```

---

## 🎉 **You're Ready to Deploy!**

**Recommended Path:**
1. Use **Command Prompt** instead of PowerShell
2. Deploy to **Vercel** (frontend) + **Render** (backend)
3. Share your live app!

**Need help?** Check the troubleshooting section in `DEPLOYMENT_GUIDE.md`

---

## 📞 **Quick Support**

If you get stuck:
1. Check Vercel deployment logs
2. Check Render deployment logs
3. Test API endpoint directly in browser
4. Check browser console for errors

**Your Moot Court Simulator is ready to go live! 🚀**
