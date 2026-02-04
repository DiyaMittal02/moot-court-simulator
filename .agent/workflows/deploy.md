---
description: Deploy the moot court simulator to production
---

# Deploy Moot Court Simulator

Follow these steps to deploy your app with all UIs working perfectly:

## Step 1: Verify Your Code is Ready

Check that all files are present:
```cmd
dir
```

## Step 2: Push to GitHub

// turbo
```cmd
git status
```

If there are changes, commit them:
```cmd
git add .
git commit -m "Ready for production deployment"
git push
```

## Step 3: Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Select repository: `DiyaMittal02/moot-court-simulator`
4. Configure:
   - Name: `moot-court-backend`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - Instance Type: Free
5. Click "Create Web Service"
6. Wait for deployment (~5 minutes)
7. Copy the URL (e.g., `https://moot-court-backend.onrender.com`)

## Step 4: Test Backend

Visit your backend URL + `/api/case-library` in browser.
You should see JSON with 10 cases.

## Step 5: Deploy Frontend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Select repository: `DiyaMittal02/moot-court-simulator`
4. Configure:
   - Name: `moot-court-frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: [Your backend URL from Step 3]
6. Click "Create Static Site"
7. Wait for deployment (~5 minutes)

## Step 6: Test Your Live App

Visit your frontend URL (e.g., `https://moot-court-frontend.onrender.com`)

Test these features:
- ✅ Login/Register page loads with proper styling
- ✅ Dashboard displays all sections
- ✅ Case Library shows 10 cases
- ✅ Can enter courtroom
- ✅ Session Recordings page works
- ✅ Create new case form works

## Step 7: Share Your App!

Your moot court simulator is now live and accessible worldwide!

**Frontend:** https://moot-court-frontend.onrender.com
**Backend:** https://moot-court-backend.onrender.com

---

## Notes

- First load may take ~30 seconds (free tier services sleep)
- All subsequent loads are fast
- To update: Just push to GitHub, Render auto-deploys
- For troubleshooting, check `COMPLETE_DEPLOYMENT_GUIDE.md`
