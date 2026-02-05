# 🚨 CRITICAL BUG: API URLs Not Using Config

## The Problem

You have `src/config/api.js` with proper environment variable handling:

```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const SOCKET_URL = import.meta.env.VOT_API_URL || 'http://localhost:4000';
```

**BUT YOUR PAGES ARE NOT USING IT!** 

They all hardcode `http://localhost:4000` instead!

---

## Files That Need Immediate Fix

### 1. `src/pages/Courtroom.jsx` ❌
**Line 120**: `const newSocket = io('http://localhost:4000');`  
**Line 327**: `fetch('http://localhost:4000/api/recordings', ...)`  
**Line 352**: `fetch('http://localhost:4000/api/ai-analyze', ...)`  

### 2. `src/pages/SessionRecordings.jsx` ❌
**Line 22**: `fetch('http://localhost:4000/api/recordings')`  
**Line 68**: `fetch('http://localhost:4000/api/recordings/${id}', ...)`  

### 3. `src/pages/Dashboard.jsx` ❌  
(Need to check for API calls)

### 4. `src/pages/CaseLibrary.jsx` ❌  
(Need to check for API calls)

### 5. `src/pages/Leaderboard.jsx` ❌  
(Need to check for API calls)

---

## The Fix (Simple!)

### BEFORE:
```javascript
const newSocket = io('http://localhost:4000');
```

### AFTER:
```javascript
import { SOCKET_URL, API_URL } from '../config/api';

const newSocket = io(SOCKET_URL);
```

---

## Why This Breaks Production

On your live site:
- Frontend: `https://moot-court-frontend.onrender.com`
- Backend: `https://moot-court-backend.onrender.com`

But your code tries to connect to `http://localhost:4000`!

**Result**: Everything fails on production! 🔴

---

## Environment Variables

You already have `.env.production`:
```
VITE_API_URL=https://moot-court-backend.onrender.com
```

But since code doesn't use `import.meta.env.VITE_API_URL`, it's ignored!

---

## Fix Checklist

- [ ] Update `Courtroom.jsx` (3 places)
- [ ] Update `SessionRecordings.jsx` (2 places)
- [ ] Update `Dashboard.jsx` (check for hardcoded URLs)
- [ ] Update `CaseLibrary.jsx` (check for hardcoded URLs)
- [ ] Update `Leaderboard.jsx` (check for hardcoded URLs)
- [ ] Test locally with `npm run dev`
- [ ] Build and test with `npm run build`
- [ ] Deploy to Render
- [ ] Verify production works

---

## Estimated Time: 30 minutes

This is a **CRITICAL** fix that must be done **BEFORE** anything else!

Without this, your live app is **completely broken**.

---

**Ready to fix this? Say the word and I'll update all the files!** 🚀
