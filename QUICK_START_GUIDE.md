# 🚀 Quick Start Guide - Moot Court Simulator

## ⚠️ IMPORTANT: You Need to Restart Your Server!

The new features won't work until you restart the server to load the updated code.

## 📋 Step-by-Step Instructions

### 1. **Stop the Current Server**
Your server is currently running on port 4000. You need to stop it first.

**Option A: Find and close the terminal running the server**
- Look for a terminal/command prompt window that says "🚀 Server listening on http://localhost:4000"
- Press `Ctrl + C` to stop it

**Option B: Kill the process (if you can't find the terminal)**
```powershell
# Find the process using port 4000
netstat -ano | findstr :4000

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F
```

### 2. **Start the Server with New Code**
Open a new terminal in your project directory and run:

```powershell
cd "C:\Users\lenovo\OneDrive\Desktop\new-moot-court"
node server/index.js
```

You should see:
```
🚀 Server listening on http://localhost:4000
```

### 3. **Start the Frontend** (if not already running)
Open another terminal and run:

```powershell
cd "C:\Users\lenovo\OneDrive\Desktop\new-moot-court"
npm run dev
```

This will start the Vite development server (usually on port 5173).

### 4. **Access the Application**
Open your browser and go to:
```
http://localhost:5173
```

---

## 🎯 Where to Find the New Features

### **📚 Case Library**
1. Navigate to Dashboard
2. Click the **"📚 Case Library"** button (top right)
3. You'll see **10 landmark cases** displayed in cards
4. Use the search bar to find specific cases
5. Use filters to sort by Category or Difficulty
6. Click **"📖 Details"** on any case to see full information
7. Click **"⚖️ Practice"** to start a courtroom session with that case

**Direct URL**: `http://localhost:5173/case-library`

### **🎥 Session Recordings**
1. Navigate to Dashboard
2. Click the **"🎥 Recordings"** button (top right)
3. You'll see **3 sample recordings** with transcripts
4. Filter by type: All / Practice / Tournament / Exam
5. Click **"▶️ Play"** to watch a recording with:
   - Interactive transcript
   - Playback controls
   - Performance insights
6. Click **"📥 Download"** to save the transcript
7. Click **"🗑️ Delete"** to remove a recording

**Direct URL**: `http://localhost:5173/recordings`

---

## ✅ Verification Checklist

After restarting, verify everything works:

- [ ] Server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Dashboard shows 3 buttons: "🎥 Recordings", "📚 Case Library", "🏆 Leaderboard"
- [ ] Case Library shows 10 cases when you click it
- [ ] Session Recordings shows 3 recordings when you click it
- [ ] You can click on cases and see details
- [ ] You can play recordings and see transcripts

---

## 🐛 Troubleshooting

### "Cannot find module" errors
Make sure you're in the correct directory:
```powershell
cd "C:\Users\lenovo\OneDrive\Desktop\new-moot-court"
```

### "Port already in use" error
Kill the existing process:
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Cases not showing up
1. Check that `data/case-library.json` exists and has content
2. Check browser console for errors (F12)
3. Verify server is running and accessible at http://localhost:4000
4. Try accessing directly: http://localhost:4000/api/case-library

### Recordings not showing up
1. Check that `data/recordings.json` exists and has content
2. Check browser console for errors (F12)
3. Try accessing directly: http://localhost:4000/api/recordings

---

## 📊 What Data is Available

### **Case Library** (10 cases):
1. Miranda v. Arizona (Criminal Law - Beginner)
2. Brown v. Board of Education (Constitutional Law - Intermediate)
3. Roe v. Wade (Constitutional Law - Advanced)
4. Donoghue v. Stevenson (Tort Law - Beginner)
5. Carlill v. Carbolic Smoke Ball (Contract Law - Beginner)
6. Salomon v. Salomon & Co Ltd (Corporate Law - Intermediate)
7. Kesavananda Bharati v. State of Kerala (Constitutional Law - Advanced)
8. R v. Dudley and Stephens (Criminal Law - Intermediate)
9. Hadley v. Baxendale (Contract Law - Intermediate)
10. Marbury v. Madison (Constitutional Law - Advanced)

### **Session Recordings** (3 recordings):
1. Miranda v. Arizona - Practice Session (Score: 85/100)
2. Brown v. Board of Education - Tournament (Score: 78/100)
3. Donoghue v. Stevenson - Practice Session (Score: 92/100)

---

## 🎉 You're All Set!

Once the server restarts, you'll have:
- ✅ A fully functional Case Library with 10 landmark cases
- ✅ Session Recording system with playback and insights
- ✅ Beautiful, modern UI with smooth animations
- ✅ All features integrated into your dashboard

**Need help?** Check the browser console (F12) for any error messages.
