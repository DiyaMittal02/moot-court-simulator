import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import NotificationToast from '../components/NotificationToast';
import { API_URL, SOCKET_URL } from '../config/api';
import './Courtroom.css';
// UUID removed – using custom generateId() function
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
const triggerTestNotification = () => {
    const dummy = {
        id: generateId(),
        type: 'test',
        message: '🚀 This is a test notification!',
    };
    setNotifications(prev => [...prev, dummy]);
};

const Courtroom = () => {
    const { caseId } = useParams();
    const navigate = useNavigate();

    // Guard against missing caseId
    if (!caseId) {
        return (
            <div className="courtroom-page">
                <p>Invalid courtroom ID.</p>
            </div>
        );
    }

    // Socket & WebRTC state
    const [socket, setSocket] = useState(null);
    const [peer, setPeer] = useState(null);
    const peersRef = useRef({}); // Use Ref for peers to avoid closure staleness
    const [stream, setStream] = useState(null);
    const streamRef = useRef(null); // Ref to access stream in callbacks
    const [remoteStream, setRemoteStream] = useState(null);

    // UI state
    const [logs, setLogs] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [role, setRole] = useState('Counsel');
    const [verdictOpen, setVerdictOpen] = useState(false);
    const [finalVerdict, setFinalVerdict] = useState(null);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [showAiPanel, setShowAiPanel] = useState(false);

    // Timer state
    const [timer, setTimer] = useState(120); // Default 2 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Notification state
    const [notifications, setNotifications] = useState([]);

    // Recording state
    const [isRecording, setIsRecording] = useState(false);
    const [recordingData, setRecordingData] = useState({
        transcript: [],
        startTime: null,
        argumentCount: 0,
        objectionCount: 0,
        speakingTime: 0,
    });
    const recordingStartTimeRef = useRef(null);

    // Media controls
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);

    // Refs
    const recognitionRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Initialize media and socket on mount
    useEffect(() => {
        const init = async () => {
            await initializeMedia();
            initializeSocket();
        };
        init();
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
            socket?.close();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Timer Countdown Effect
    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    // Media initialization
    const initializeMedia = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            streamRef.current = mediaStream; // Update ref
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
            console.log('✅ Media initialized:', mediaStream.id);
        } catch (err) {
            console.error('❌ Media access denied:', err);
            addLog('System', 'Camera/Microphone access denied. Voice and video features disabled.', 'alert');
        }
    };

    // Socket initialization and event handling
    const initializeSocket = () => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            newSocket.emit('join_case', caseId);
            // Auto-start recording when joining
            setTimeout(() => startRecording(), 1000);
        });

        // Generic notifications (Real-time!)
        newSocket.on('notification', data => {
            console.log('🔔 Notification received:', data);
            setNotifications(prev => [...prev, { ...data, id: generateId() }]);
        });

        // User joined (Logic only)
        newSocket.on('user_joined', data => {
            console.log('👤 User joined:', data.userId);
            addLog('System', `${data.userId} joined the courtroom`, 'normal');
            // Only initiate if we have a stream (which we should now)
            if (streamRef.current) {
                console.log('🚀 Initiating peer connection to:', data.userId);
                createPeer(data.userId, true, null, newSocket);
            } else {
                console.warn('⚠️ User joined but local stream is missing!');
            }
        });

        // Argument received
        newSocket.on('receive_argument', data => {
            addLog(data.sender, data.text, data.type);
        });

        // Verdict received (Logic only)
        newSocket.on('receive_verdict', data => {
            setFinalVerdict(data.verdict);
            addLog('System', `VERDICT ISSUED: ${data.verdict}`, 'alert');
        });

        // Timer events
        newSocket.on('timer_start', data => {
            setTimer(data.duration);
            setIsTimerRunning(true);
        });

        newSocket.on('timer_stop', () => {
            setIsTimerRunning(false);
        });

        newSocket.on('timer_reset', data => {
            setTimer(data.duration);
            setIsTimerRunning(false);
        });

        // WebRTC signaling
        newSocket.on('webrtc_offer', ({ from, offer }) => {
            console.log('📨 Received offer from:', from);
            createPeer(from, false, offer, newSocket);
        });
        newSocket.on('webrtc_answer', ({ from, answer }) => {
            console.log('📨 Received answer from:', from);
            const peer = peersRef.current[from];
            if (peer) {
                peer.signal(answer);
            }
        });
        newSocket.on('webrtc_ice_candidate', ({ from, candidate }) => {
            const peer = peersRef.current[from];
            if (peer) {
                peer.signal(candidate);
            }
        });

        // Speech recognition setup
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            recognition.onresult = event => {
                const transcript = event.results[0][0].transcript;
                handleSendArgument(transcript);
                setIsListening(false);
            };
            recognition.onerror = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    };

    // Peer creation
    const createPeer = (userId, initiator, offer = null, socketInstance = null) => {
        const newPeer = new Peer({
            initiator,
            trickle: true,
            stream: streamRef.current
        });

        // Use the passed socket instance or fall back to state (though state might be null initially)
        const activeSocket = socketInstance || socket;

        newPeer.on('signal', signal => {
            if (activeSocket) {
                if (initiator) {
                    activeSocket.emit('webrtc_offer', { to: userId, offer: signal });
                } else {
                    activeSocket.emit('webrtc_answer', { to: userId, answer: signal });
                }
            } else {
                console.error("❌ Socket is null in createPeer signal handler!");
            }
        });

        newPeer.on('stream', remote => {
            setRemoteStream(remote);
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
        });
        if (offer) newPeer.signal(offer);

        peersRef.current[userId] = newPeer;
        setPeer(newPeer);
    };

    // Logging helper
    const addLog = (sender, text, type = 'normal') => {
        const logEntry = {
            id: Date.now(),
            sender,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type,
        };

        setLogs(prev => [...prev, logEntry]);

        // Add to recording transcript if recording
        if (isRecording && recordingStartTimeRef.current) {
            const timestamp = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
            setRecordingData(prev => ({
                ...prev,
                transcript: [...prev.transcript, {
                    timestamp,
                    speaker: sender,
                    text
                }],
                argumentCount: type === 'normal' ? prev.argumentCount + 1 : prev.argumentCount,
                objectionCount: text.includes('OBJECTION') ? prev.objectionCount + 1 : prev.objectionCount,
            }));
        }
    };

    // Start recording
    const startRecording = () => {
        recordingStartTimeRef.current = Date.now();
        setIsRecording(true);
        setRecordingData({
            transcript: [],
            startTime: new Date().toISOString(),
            argumentCount: 0,
            objectionCount: 0,
            speakingTime: 0,
        });
        addLog('System', '🔴 Recording started', 'alert');
    };

    // Stop recording and save
    const stopRecording = async () => {
        if (!isRecording) return;

        setIsRecording(false);
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);

        // Calculate score based on activity
        const baseScore = 60;
        const argumentBonus = Math.min(recordingData.argumentCount * 2, 30);
        const participationBonus = duration > 60 ? 10 : 0;
        const score = Math.min(baseScore + argumentBonus + participationBonus, 100);

        // Generate insights
        const insights = {
            strengths: [
                recordingData.argumentCount > 5 ? 'Good number of arguments presented' : 'Participated in the session',
                'Maintained courtroom decorum',
                duration > 120 ? 'Sustained engagement throughout session' : 'Active participation'
            ],
            improvements: [
                recordingData.argumentCount < 5 ? 'Present more arguments to strengthen your case' : 'Consider more varied argument types',
                recordingData.objectionCount === 0 ? 'Use objections strategically when appropriate' : 'Good use of objections',
                'Practice citing more legal precedents'
            ]
        };

        const recording = {
            caseTitle: `Case #${caseId}`,
            type: 'Practice',
            role: role,
            duration,
            speakingTime: Math.floor(duration * 0.7), // Estimate
            argumentCount: recordingData.argumentCount,
            objectionCount: recordingData.objectionCount,
            score,
            hasHighlights: recordingData.objectionCount > 0 || recordingData.argumentCount > 8,
            transcript: recordingData.transcript,
            insights
        };

        try {
            await fetch(`${API_URL}/api/recordings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recording)
            });
            addLog('System', `✅ Session recorded! Score: ${score}/100`, 'alert');
        } catch (err) {
            console.error('Failed to save recording:', err);
            addLog('System', '⚠️ Failed to save recording', 'alert');
        }
    };

    // Argument handling with AI feedback
    const handleSendArgument = async text => {
        if (!text.trim()) return;
        addLog('You', text);
        if (socket) {
            socket.emit('send_argument', {
                caseId,
                sender: role === 'Judge' ? 'Judge' : 'Opposing Counsel',
                text,
                type: 'normal',
            });
        }
        try {
            const res = await fetch(`${API_URL}/api/ai-analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ argument: text }),
            });
            const feedback = await res.json();
            setAiFeedback(feedback);
            setShowAiPanel(true);
        } catch (err) {
            console.error('AI analysis failed:', err);
        }
    };

    // Mic toggle
    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    // Audio toggle
    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => (track.enabled = !audioEnabled));
            setAudioEnabled(!audioEnabled);
        }
    };

    // Video toggle
    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => (track.enabled = !videoEnabled));
            setVideoEnabled(!videoEnabled);
        }
    };

    // Timer Controls
    const startTimer = () => {
        if (socket) socket.emit('timer_start', { caseId, duration: timer });
        setIsTimerRunning(true);
    };

    const stopTimer = () => {
        if (socket) socket.emit('timer_stop', { caseId });
        setIsTimerRunning(false);
    };

    const resetTimer = (duration = 120) => {
        if (socket) socket.emit('timer_reset', { caseId, duration });
        setTimer(duration);
        setIsTimerRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };


    // Objection handling
    const handleObjection = () => {
        const text = 'OBJECTION!';
        addLog('You', text, 'alert');
        if (socket) {
            socket.emit('send_argument', {
                caseId,
                sender: role === 'Judge' ? 'Judge' : 'Opposing Counsel',
                text,
                type: 'alert',
            });
        }
    };

    // Verdict issuance
    const issueVerdict = verdict => {
        setFinalVerdict(verdict);
        setVerdictOpen(false);
        if (socket) socket.emit('issue_verdict', { caseId, verdict });
    };

    return (
        <div className="courtroom-page">
            {/* Notification toasts */}
            {notifications.map((n, i) => (
                <NotificationToast
                    key={i}
                    notification={n}
                    onClose={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))}
                />
            ))}

            {/* Header */}
            <header className="courtroom-header">
                <div className="header-left">
                    <button onClick={() => navigate('/dashboard')} className="back-btn">
                        ← Back
                    </button>
                    <div className="case-info">
                        <h3>Case #{caseId}</h3>
                        <div className="live-badge">
                            <span className="pulse-dot"></span>
                            <span>LIVE SESSION</span>
                        </div>
                    </div>
                </div>

                {/* Timer Display */}
                <div className={`timer-display ${timer < 30 ? 'urgent' : ''}`}>
                    <span className="timer-icon">⏱️</span>
                    <span className="timer-value">{formatTime(timer)}</span>
                </div>

                <div className="header-right">
                    <div className="role-selector">
                        <button
                            onClick={() => setRole('Counsel')}
                            className={`role-btn ${role === 'Counsel' ? 'active' : ''}`}
                        >
                            Counsel
                        </button>
                        <button
                            onClick={() => setRole('Judge')}
                            className={`role-btn ${role === 'Judge' ? 'active judge' : ''}`}
                        >
                            Judge
                        </button>
                    </div>
                    <button
                        onClick={triggerTestNotification}
                        className="notification-test-btn"
                        title="Show a test toast"
                    >
                        🔔 Test
                    </button>
                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="recording-btn"
                            title="Stop and save recording"
                        >
                            🔴 Stop Recording
                        </button>
                    )}
                    {role === 'Judge' && (
                        <button onClick={() => setVerdictOpen(true)} className="verdict-btn">
                            ⚖️ Issue Verdict
                        </button>
                    )}
                </div>
            </header>

            <main className="courtroom-main">
                {/* Video Section */}
                <div className="video-section">
                    <div className="video-grid">
                        {/* Remote Video */}
                        <div className="video-container main-video">
                            <video ref={remoteVideoRef} autoPlay playsInline className="video-element" />
                            {!remoteStream && (
                                <div className="video-placeholder">
                                    <div className="placeholder-icon">👤</div>
                                    <p>Waiting for other participant...</p>
                                </div>
                            )}
                            <div className="video-label">
                                <span className="status-dot"></span>
                                {role === 'Judge' ? 'Counsel' : 'Judge'}
                            </div>
                        </div>
                        {/* Local Video */}
                        <div className="video-container local-video">
                            <video ref={localVideoRef} autoPlay muted playsInline className="video-element" />
                            <div className="video-label">
                                <span className="status-dot"></span>
                                You ({role})
                            </div>
                        </div>
                    </div>

                    {/* Verdict Overlay */}
                    {finalVerdict && (
                        <div className="verdict-overlay">
                            <div className="verdict-content">
                                <div className="verdict-icon">
                                    {finalVerdict === 'Guilty' ? '🔒' : '🔓'}
                                </div>
                                <p className="verdict-label">The Court Finds the Defendant</p>
                                <h2 className={`verdict-result ${finalVerdict === 'Guilty' ? 'guilty' : 'not-guilty'}`}>
                                    {finalVerdict}
                                </h2>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="controls-bar">
                        <button onClick={toggleAudio} className={`control-btn ${!audioEnabled ? 'disabled' : ''}`}>
                            {audioEnabled ? '🎤' : '🔇'}
                        </button>
                        <button onClick={toggleVideo} className={`control-btn ${!videoEnabled ? 'disabled' : ''}`}>
                            {videoEnabled ? '📹' : '📵'}
                        </button>
                        <button onClick={toggleMic} className={`control-btn mic-btn ${isListening ? 'active' : ''}`}>
                            🎙️
                        </button>

                        <div className="divider"></div>

                        {/* Judge Timer Controls */}
                        {role === 'Judge' && (
                            <>
                                <button onClick={isTimerRunning ? stopTimer : startTimer} className="control-btn timer-control">
                                    {isTimerRunning ? '⏸️' : '▶️'}
                                </button>
                                <button onClick={() => resetTimer(120)} className="control-btn timer-control">
                                    🔄
                                </button>
                                <div className="divider"></div>
                            </>
                        )}

                        <button onClick={handleObjection} className="objection-btn">
                            ✋ OBJECTION
                        </button>
                        <button onClick={() => setShowAiPanel(!showAiPanel)} className="ai-btn">
                            🤖 AI Feedback
                        </button>
                    </div>
                </div>

                {/* Transcript Sidebar */}
                <aside className="transcript-sidebar">
                    <div className="sidebar-header">
                        <h4>📝 Court Transcript</h4>
                    </div>
                    <div className="transcript-logs">
                        {logs.length === 0 && (
                            <p className="empty-transcript">Session started. Waiting for arguments...</p>
                        )}
                        {logs.map(log => (
                            <div key={log.id} className={`log-entry ${log.sender === 'You' ? 'own' : ''}`}>
                                <div className="log-meta">
                                    <span className={`log-sender ${log.sender.toLowerCase()}`}>{log.sender}</span>
                                    <span className="log-time">{log.time}</span>
                                </div>
                                <div className={`log-message ${log.type}`}>{log.text}</div>
                            </div>
                        ))}
                    </div>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSendArgument(e.target.message.value);
                            e.target.message.value = '';
                        }}
                        className="message-form"
                    >
                        <input name="message" type="text" placeholder="Type your argument..." />
                        <button type="submit" className="send-btn">
                            ➤
                        </button>
                    </form>
                </aside>
            </main>

            {/* AI Feedback Panel */}
            {showAiPanel && aiFeedback && (
                <div className="ai-panel">
                    <div className="ai-panel-header">
                        <h4>🤖 AI Analysis</h4>
                        <button onClick={() => setShowAiPanel(false)} className="close-ai">
                            ✕
                        </button>
                    </div>
                    <div className="ai-content">
                        <div className="ai-score">
                            <div className="score-circle">
                                <span className="score-value">{aiFeedback.score}</span>
                                <span className="score-label">/100</span>
                            </div>
                        </div>
                        <div className="ai-section">
                            <h5>✅ Strengths</h5>
                            <ul>
                                {aiFeedback.strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="ai-section">
                            <h5>💡 Improvements</h5>
                            <ul>
                                {aiFeedback.improvements.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="ai-suggestion">
                            <strong>Suggestion:</strong> {aiFeedback.suggestion}
                        </div>
                    </div>
                </div>
            )}

            {/* Verdict Modal */}
            {verdictOpen && (
                <div className="modal-overlay" onClick={() => setVerdictOpen(false)}>
                    <div className="modal verdict-modal" onClick={e => e.stopPropagation()}>
                        <div className="verdict-modal-header">
                            <h3>Final Verdict</h3>
                            <p>As the presiding Judge, how do you find the defendant?</p>
                        </div>
                        <div className="verdict-options">
                            <button onClick={() => issueVerdict('Guilty')} className="verdict-option guilty-option">
                                <div className="verdict-emoji">🔒</div>
                                <div className="verdict-label-btn">GUILTY</div>
                            </button>
                            <button onClick={() => issueVerdict('Not Guilty')} className="verdict-option not-guilty-option">
                                <div className="verdict-emoji">🔓</div>
                                <div className="verdict-label-btn">NOT GUILTY</div>
                            </button>
                        </div>
                        <button onClick={() => setVerdictOpen(false)} className="cancel-link">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Courtroom;
