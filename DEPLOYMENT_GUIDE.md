# Deployment Guide - Moot Court Simulator

## 🚀 Quick Deploy (Recommended)

### **Option 1: Deploy to Vercel + Render (Free)**

#### **Part A: Deploy Frontend to Vercel**

1. **Install Vercel CLI** (if not already installed):
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```powershell
   vercel login
   ```

3. **Deploy Frontend**:
   ```powershell
   vercel --prod
   ```
   - Follow the prompts
   - Project name: `moot-court-simulator`
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Your frontend will be live at**: `https://moot-court-simulator.vercel.app`

---

#### **Part B: Deploy Backend to Render**

1. **Go to** [render.com](https://render.com) and sign up/login

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository (or use manual deploy)

3. **Configure Service**:
   - **Name**: `moot-court-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

4. **Add Environment Variables** (if needed):
   - `PORT`: 4000 (Render will override this)
   - `NODE_ENV`: production

5. **Deploy** - Click "Create Web Service"

6. **Your backend will be live at**: `https://moot-court-server.onrender.com`

---

#### **Part C: Connect Frontend to Backend**

1. **Update API URLs in your frontend**:
   
   Create a `.env.production` file:
   ```
   VITE_API_URL=https://moot-court-server.onrender.com
   ```

2. **Update all fetch calls** to use environment variable:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
   fetch(`${API_URL}/api/case-library`)
   ```

3. **Redeploy frontend**:
   ```powershell
   vercel --prod
   ```

---

## 🔧 **Alternative: Deploy Everything to Render**

If you want both frontend and backend on Render:

### **Deploy Full Stack to Render**

1. **Create a `render.yaml`** file in your project root

2. **Push to GitHub**

3. **Connect Render to your GitHub repo**

4. **Render will auto-deploy** both services

---

## 📦 **Before Deploying - Checklist**

- [ ] All dependencies in `package.json`
- [ ] Build script works: `npm run build`
- [ ] Server starts correctly: `node server/index.js`
- [ ] Environment variables configured
- [ ] CORS settings allow your frontend domain
- [ ] Database files are in `data/` directory

---

## 🌐 **Update CORS for Production**

In `server/index.js`, update CORS:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://moot-court-simulator.vercel.app', // Your Vercel domain
        'https://your-custom-domain.com' // If you have one
    ],
    credentials: true
}));
```

---

## 🎯 **Quick Commands**

### **Deploy Frontend (Vercel)**
```powershell
# First time
vercel

# Production
vercel --prod
```

### **Test Build Locally**
```powershell
# Build
npm run build

# Preview
npm run preview
```

### **Check Server**
```powershell
node server/index.js
```

---

## 🔒 **Security Notes**

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use environment variables for sensitive data
3. **CORS**: Only allow specific domains in production
4. **Rate Limiting**: Consider adding rate limiting to API

---

## 📊 **Post-Deployment**

After deployment:
1. Test all features on live site
2. Check browser console for errors
3. Verify API connections work
4. Test WebRTC functionality
5. Check recording feature saves correctly

---

## 🆘 **Troubleshooting**

### **Frontend not loading**
- Check build logs in Vercel dashboard
- Verify `dist` folder is created
- Check `vercel.json` configuration

### **Backend not connecting**
- Check Render logs
- Verify environment variables
- Test API endpoint directly: `https://your-backend.onrender.com/api/case-library`

### **CORS errors**
- Update CORS origins in `server/index.js`
- Redeploy backend

### **WebRTC not working**
- WebRTC requires HTTPS in production
- Both Vercel and Render provide HTTPS automatically

---

## 🎉 **Your App Will Be Live!**

**Frontend**: `https://moot-court-simulator.vercel.app`  
**Backend**: `https://moot-court-server.onrender.com`

Share your live app with the world! 🚀
