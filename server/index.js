// ---------------------------------------------------------------
// server/index.js
// ---------------------------------------------------------------
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

// ---------- LowDB (JSON file persistence) ----------
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';

// 1️⃣  Set up paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = join(__dirname, '..', 'data'); // <-- ../data relative to server/

// 2️⃣  Initialise LowDB stores
const leaderboardAdapter = new JSONFile(join(dataDir, 'leaderboard.json'));
export const leaderboardDB = new Low(leaderboardAdapter, []);
await leaderboardDB.read();

const achievementsAdapter = new JSONFile(join(dataDir, 'achievements.json'));
export const achievementsDB = new Low(achievementsAdapter, []);
await achievementsDB.read();

const analyticsAdapter = new JSONFile(join(dataDir, 'analytics.json'));
export const analyticsDB = new Low(analyticsAdapter, {});
await analyticsDB.read();

const casesAdapter = new JSONFile(join(dataDir, 'cases.json'));
export const casesDB = new Low(casesAdapter, []);
await casesDB.read();

const recordingsAdapter = new JSONFile(join(dataDir, 'recordings.json'));
export const recordingsDB = new Low(recordingsAdapter, []);
await recordingsDB.read();

// 3️⃣  Express & Socket.io setup (app → server → cors → io)
const app = express();
const server = http.createServer(app);

// ---------- CORS ----------
app.use(
    cors({
        origin: [
            // Local dev
            'http://localhost:5173',
            // Render frontend (main domain)
            'https://moot-court-frontend.onrender.com',
            // Render preview URLs (e.g. https://moot-court-frontend-abc123.onrender.com)
            /^https:\/\/moot-court-frontend-.*\.onrender\.com$/,
            // (Optional) keep Vercel URLs if you ever test there again
            'https://moot-court-simulator.vercel.app',
            'https://moot-court-simulator-git-main-diyamittal02s-projects.vercel.app',
            /^https:\/\/moot-court-simulator-.*\.vercel\.app$/,
        ],
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(express.static('public'));

// ---------- Socket.io ----------
const io = new SocketIOServer(server, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://moot-court-frontend.onrender.com',
            /^https:\/\/moot-court-frontend-.*\.onrender\.com$/,
        ],
        methods: ['GET', 'POST'],
    },
});

// 4️⃣  Helper – broadcast a generic notification to all sockets
const broadcastNotification = (type, message) => {
    io.emit('notification', { type, message });
};

// 5️⃣  API ROUTES
// ----- Case Library ------------------------------------------------
app.get('/api/case-library', async (req, res) => {
    try {
        const caseLibraryPath = join(dataDir, 'case-library.json');
        const data = await fs.readFile(caseLibraryPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Failed to read case library:', err);
        res.status(500).json({ error: 'Failed to load case library' });
    }
});

// ----- Cases -------------------------------------------------------
app.get('/api/cases', async (req, res) => {
    await casesDB.read();
    res.json(casesDB.data);
});

app.post('/api/cases', async (req, res) => {
    const { title, fileName, fileData, isTemplate, templateId } = req.body;
    await casesDB.read();
    const newCase = {
        id: randomUUID(),
        title,
        fileName,
        fileData,
        isTemplate: isTemplate || false,
        templateId: templateId || null,
        createdAt: new Date().toISOString(),
    };
    casesDB.data.push(newCase);
    await casesDB.write();
    res.json({ success: true, case: newCase });
});

// ----- Recordings --------------------------------------------------
app.get('/api/recordings', async (req, res) => {
    await recordingsDB.read();
    res.json(recordingsDB.data);
});

app.post('/api/recordings', async (req, res) => {
    const recording = req.body;
    await recordingsDB.read();
    const newRecording = {
        id: randomUUID(),
        ...recording,
        recordedAt: new Date().toISOString(),
    };
    recordingsDB.data.push(newRecording);
    await recordingsDB.write();
    res.json({ success: true, recording: newRecording });
});

app.delete('/api/recordings/:id', async (req, res) => {
    const { id } = req.params;
    await recordingsDB.read();
    const index = recordingsDB.data.findIndex((r) => r.id === id);
    if (index !== -1) {
        recordingsDB.data.splice(index, 1);
        await recordingsDB.write();
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Recording not found' });
    }
});

// ----- Leaderboard -------------------------------------------------
app.get('/api/leaderboard', async (req, res) => {
    await leaderboardDB.read();
    res.json(leaderboardDB.data);
});

app.post('/api/leaderboard', async (req, res) => {
    const { userId, score } = req.body;
    await leaderboardDB.read();
    const existing = leaderboardDB.data.find((u) => u.userId === userId);
    if (existing) {
        existing.score = Math.max(existing.score, score);
    } else {
        leaderboardDB.data.push({ userId, score });
    }
    await leaderboardDB.write();
    broadcastNotification('leaderboard', `${userId} updated their score`);
    res.json({ success: true, leaderboard: leaderboardDB.data });
});

// ----- Achievements ------------------------------------------------
app.get('/api/achievements/:userId', async (req, res) => {
    const { userId } = req.params;
    await achievementsDB.read();
    const userAch = achievementsDB.data.filter((a) => a.userId === userId);
    res.json(userAch);
});

app.post('/api/achievements', async (req, res) => {
    const { userId, achievement } = req.body;
    await achievementsDB.read();
    achievementsDB.data.push({
        userId,
        achievement,
        earnedAt: new Date().toISOString(),
    });
    await achievementsDB.write();
    broadcastNotification('achievement', `${userId} unlocked "${achievement}"`);
    res.json({ success: true });
});

// ----- Case Analytics -----------------------------------------------
app.get('/api/analytics/:caseId', async (req, res) => {
    const { caseId } = req.params;
    await analyticsDB.read();
    const stats = analyticsDB.data[caseId] || {};
    res.json(stats);
});

app.post('/api/analytics/:caseId', async (req, res) => {
    const { caseId } = req.params;
    const updates = req.body;
    await analyticsDB.read();
    analyticsDB.data[caseId] = {
        ...(analyticsDB.data[caseId] || {}),
        ...updates,
    };
    await analyticsDB.write();
    broadcastNotification('analytics', `Analytics updated for case ${caseId}`);
    res.json({ success: true, stats: analyticsDB.data[caseId] });
});

// ----- AI Mock -----------------------------------------------------
app.post('/api/ai-analyze', async (req, res) => {
    const { argument } = req.body;
    const length = argument.length;
    const score = Math.min(100, Math.max(0, 100 - Math.abs(200 - length)));
    const feedback = {
        score,
        strengths: ['Clear structure', 'Good vocabulary'],
        improvements: ['Add more evidence', 'Use stronger transitions'],
        suggestion: 'Consider citing a precedent to strengthen your point.',
    };
    res.json(feedback);
});

app.post('/api/ai-strategy', async (req, res) => {
    const { caseTitle } = req.body;
    const strategies = {
        'Miranda v. Arizona': {
            coreIssue: 'Whether custodial interrogation requires constitutional warnings',
            probabilityOfSuccess: 75,
            winningPath:
                'Focus on the coercive nature of custodial interrogation and the need for procedural safeguards to protect Fifth Amendment rights',
            opponentWeakness:
                'Difficulty proving confession was truly voluntary without clear safeguards',
            precedents: [
                { name: 'Escobedo v. Illinois', relevance: 'Established right to counsel during interrogation' },
                { name: 'Gideon v. Wainwright', relevance: 'Right to counsel is fundamental' },
            ],
        },
        'Brown v. Board of Education': {
            coreIssue: 'Whether racial segregation in public schools violates Equal Protection',
            probabilityOfSuccess: 85,
            winningPath: 'Demonstrate that separate facilities are inherently unequal and cause psychological harm',
            opponentWeakness: 'Cannot prove separate facilities are truly equal in all respects',
            precedents: [
                { name: 'Sweatt v. Painter', relevance: 'Found inequality in segregated professional schools' },
                { name: 'McLaurin v. Oklahoma', relevance: 'Segregation within schools creates inequality' },
            ],
        },
    };
    const defaultStrategy = {
        coreIssue: 'Identify the central legal question at stake in this case',
        probabilityOfSuccess: 65,
        winningPath:
            'Build a strong factual foundation, cite relevant precedents, and demonstrate how the law supports your position',
        opponentWeakness: 'Look for gaps in their evidence and inconsistencies in their legal reasoning',
        precedents: [
            { name: 'Relevant Case Law 1', relevance: 'Supports your legal theory' },
            { name: 'Relevant Case Law 2', relevance: "Distinguishes opponent's arguments" },
        ],
    };
    const strategy = strategies[caseTitle] || defaultStrategy;
    res.json(strategy);
});

// 6️⃣  Socket.io events
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    // ----- Room management -----
    socket.on('join_case', (caseId) => {
        socket.join(`case_${caseId}`);
        socket.to(`case_${caseId}`).emit('user_joined', { userId: socket.id });
        broadcastNotification('user_joined', `${socket.id} joined case ${caseId}`);
    });
    // ----- Argument flow -----
    socket.on('send_argument', (data) => {
        io.to(`case_${data.caseId}`).emit('receive_argument', data);
    });
    // ----- Verdict -----
    socket.on('issue_verdict', (data) => {
        io.to(`case_${data.caseId}`).emit('receive_verdict', data);
        broadcastNotification('verdict', `Verdict issued in case ${data.caseId}: ${data.verdict}`);
    });
    // ----- WebRTC signalling -----
    socket.on('webrtc_offer', (payload) => {
        socket.to(payload.to).emit('webrtc_offer', { from: socket.id, offer: payload.offer });
    });
    socket.on('webrtc_answer', (payload) => {
        socket.to(payload.to).emit('webrtc_answer', { from: socket.id, answer: payload.answer });
    });
    socket.on('webrtc_ice_candidate', (payload) => {
        socket.to(payload.to).emit('webrtc_ice_candidate', { from: socket.id, candidate: payload.candidate });
    });
    // ----- Timer controls (used by the judge) -----
    socket.on('timer_start', (data) => {
        io.to(`case_${data.caseId}`).emit('timer_start', data);
    });
    socket.on('timer_stop', (data) => {
        io.to(`case_${data.caseId}`).emit('timer_stop', data);
    });
    socket.on('timer_reset', (data) => {
        io.to(`case_${data.caseId}`).emit('timer_reset', data);
    });
    // ----- Disconnect -----
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 7️⃣  Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});