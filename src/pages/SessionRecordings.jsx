import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import './SessionRecordings.css';

const SessionRecordings = () => {
    const navigate = useNavigate();
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        fetchRecordings();
    }, []);

    const fetchRecordings = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recordings`);
            const data = await res.json();
            setRecordings(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch recordings", err);
            setLoading(false);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const playRecording = (recording) => {
        setSelectedRecording(recording);
        setShowPlayerModal(true);
        setPlaybackTime(0);
        setIsPlaying(false);
    };

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const seekTo = (time) => {
        setPlaybackTime(time);
    };

    const deleteRecording = async (recordingId) => {
        if (!confirm('Are you sure you want to delete this recording?')) return;

        try {
            await fetch(`${API_URL}/api/recordings/${recordingId}`, {
                method: 'DELETE'
            });
            fetchRecordings();
        } catch (err) {
            console.error("Failed to delete recording", err);
        }
    };

    const downloadRecording = async (recording) => {
        // Create a downloadable transcript
        const transcript = recording.transcript.map(entry =>
            `[${formatDuration(entry.timestamp)}] ${entry.speaker}: ${entry.text}`
        ).join('\n');

        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${recording.caseTitle}_transcript.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredRecordings = filterType === 'All'
        ? recordings
        : recordings.filter(r => r.type === filterType);

    // Simulate playback progress
    useEffect(() => {
        if (isPlaying && selectedRecording) {
            const interval = setInterval(() => {
                setPlaybackTime(prev => {
                    if (prev >= selectedRecording.duration) {
                        setIsPlaying(false);
                        return selectedRecording.duration;
                    }
                    return prev + playbackSpeed;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, selectedRecording, playbackSpeed]);

    const getCurrentTranscriptEntry = () => {
        if (!selectedRecording) return null;
        return selectedRecording.transcript.find((entry, idx) => {
            const nextEntry = selectedRecording.transcript[idx + 1];
            return playbackTime >= entry.timestamp &&
                (!nextEntry || playbackTime < nextEntry.timestamp);
        });
    };

    return (
        <div className="recordings-page">
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="container recordings-container">
                <header className="recordings-header">
                    <div>
                        <h2 className="gradient-text">Session Recordings</h2>
                        <p>Review and learn from your courtroom performances</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                        ← Back to Dashboard
                    </button>
                </header>

                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-tabs">
                        {['All', 'Practice', 'Tournament', 'Exam'].map(type => (
                            <button
                                key={type}
                                className={`filter-tab ${filterType === type ? 'active' : ''}`}
                                onClick={() => setFilterType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="recordings-count">
                        {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Recordings List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : filteredRecordings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎥</div>
                        <h3>No Recordings Yet</h3>
                        <p>Your courtroom sessions will be automatically recorded and appear here</p>
                    </div>
                ) : (
                    <div className="recordings-list">
                        {filteredRecordings.map((recording) => (
                            <div key={recording.id} className="recording-card">
                                <div className="recording-thumbnail">
                                    <div className="thumbnail-icon">🎬</div>
                                    <div className="duration-badge">{formatDuration(recording.duration)}</div>
                                    {recording.hasHighlights && (
                                        <div className="highlight-badge">⭐ Highlights</div>
                                    )}
                                </div>

                                <div className="recording-info">
                                    <h3>{recording.caseTitle}</h3>
                                    <div className="recording-meta">
                                        <span className="meta-item">
                                            📅 {formatDate(recording.recordedAt)}
                                        </span>
                                        <span className="meta-item">
                                            👤 {recording.role}
                                        </span>
                                        <span className="meta-item">
                                            🎯 Score: {recording.score}/100
                                        </span>
                                    </div>

                                    <div className="recording-stats">
                                        <div className="stat">
                                            <span className="stat-label">Arguments</span>
                                            <span className="stat-value">{recording.argumentCount}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Objections</span>
                                            <span className="stat-value">{recording.objectionCount}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Speaking Time</span>
                                            <span className="stat-value">{formatDuration(recording.speakingTime)}</span>
                                        </div>
                                    </div>

                                    <div className="recording-actions">
                                        <button
                                            onClick={() => playRecording(recording)}
                                            className="btn btn-primary"
                                        >
                                            ▶️ Play
                                        </button>
                                        <button
                                            onClick={() => downloadRecording(recording)}
                                            className="btn btn-secondary"
                                        >
                                            📥 Download
                                        </button>
                                        <button
                                            onClick={() => deleteRecording(recording.id)}
                                            className="btn btn-danger"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Playback Modal */}
            {showPlayerModal && selectedRecording && (
                <div className="modal-overlay" onClick={() => setShowPlayerModal(false)}>
                    <div className="modal player-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowPlayerModal(false)}>✕</button>

                        <div className="player-header">
                            <h3>{selectedRecording.caseTitle}</h3>
                            <p>{formatDate(selectedRecording.recordedAt)}</p>
                        </div>

                        <div className="player-content">
                            {/* Video/Audio Player Placeholder */}
                            <div className="video-player">
                                <div className="player-screen">
                                    <div className="current-speaker">
                                        {getCurrentTranscriptEntry()?.speaker || 'Loading...'}
                                    </div>
                                    <div className="current-text">
                                        {getCurrentTranscriptEntry()?.text || 'Waiting for playback...'}
                                    </div>
                                </div>
                            </div>

                            {/* Playback Controls */}
                            <div className="player-controls">
                                <button onClick={togglePlayback} className="play-button">
                                    {isPlaying ? '⏸️' : '▶️'}
                                </button>

                                <div className="timeline">
                                    <input
                                        type="range"
                                        min="0"
                                        max={selectedRecording.duration}
                                        value={playbackTime}
                                        onChange={(e) => seekTo(parseInt(e.target.value))}
                                        className="timeline-slider"
                                    />
                                    <div className="time-display">
                                        {formatDuration(playbackTime)} / {formatDuration(selectedRecording.duration)}
                                    </div>
                                </div>

                                <select
                                    value={playbackSpeed}
                                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                                    className="speed-selector"
                                >
                                    <option value="0.5">0.5x</option>
                                    <option value="1">1x</option>
                                    <option value="1.5">1.5x</option>
                                    <option value="2">2x</option>
                                </select>
                            </div>

                            {/* Transcript */}
                            <div className="transcript-panel">
                                <h4>📝 Transcript</h4>
                                <div className="transcript-list">
                                    {selectedRecording.transcript.map((entry, idx) => (
                                        <div
                                            key={idx}
                                            className={`transcript-entry ${getCurrentTranscriptEntry() === entry ? 'active' : ''
                                                }`}
                                            onClick={() => seekTo(entry.timestamp)}
                                        >
                                            <span className="entry-time">{formatDuration(entry.timestamp)}</span>
                                            <span className="entry-speaker">{entry.speaker}:</span>
                                            <span className="entry-text">{entry.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Insights */}
                            <div className="insights-panel">
                                <h4>📊 Performance Insights</h4>
                                <div className="insights-grid">
                                    <div className="insight-card">
                                        <div className="insight-icon">💪</div>
                                        <h5>Strengths</h5>
                                        <ul>
                                            {selectedRecording.insights.strengths.map((s, idx) => (
                                                <li key={idx}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="insight-card">
                                        <div className="insight-icon">📈</div>
                                        <h5>Areas to Improve</h5>
                                        <ul>
                                            {selectedRecording.insights.improvements.map((i, idx) => (
                                                <li key={idx}>{i}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionRecordings;
