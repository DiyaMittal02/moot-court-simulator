import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newCaseTitle, setNewCaseTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [strategyLoading, setStrategyLoading] = useState(false);
    const [activeStrategy, setActiveStrategy] = useState(null);
    const [selectedCaseForStrategy, setSelectedCaseForStrategy] = useState(null);

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/cases');
            const data = await res.json();
            setCases(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch cases", err);
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!newCaseTitle || !selectedFile) return;

        const payload = {
            title: newCaseTitle,
            fileName: selectedFile.name,
            fileData: "Mock file content"
        };

        try {
            const res = await fetch('http://localhost:4000/api/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowUploadModal(false);
                setNewCaseTitle('');
                setSelectedFile(null);
                fetchCases();
            }
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const generateStrategy = async (caseItem) => {
        setSelectedCaseForStrategy(caseItem);
        setShowStrategyModal(true);
        setStrategyLoading(true);
        setActiveStrategy(null);

        try {
            const res = await fetch('http://localhost:4000/api/ai-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caseTitle: caseItem.title, fileName: caseItem.fileName })
            });
            const data = await res.json();
            setActiveStrategy(data);
        } catch (err) {
            console.error("Strategy generation failed", err);
        } finally {
            setStrategyLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="container dashboard-container">
                <header className="dashboard-header">
                    <div>
                        <h2 className="gradient-text">Your Cases</h2>
                        <p>Manage and track all your courtroom battles</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link to="/recordings" className="btn btn-secondary">
                            🎥 Recordings
                        </Link>
                        <Link to="/case-library" className="btn btn-secondary">
                            📚 Case Library
                        </Link>
                        <Link to="/leaderboard" className="btn btn-secondary">
                            🏆 Leaderboard
                        </Link>
                        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
                            <span>+</span> New Case
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : cases.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3>No Cases Yet</h3>
                        <p>Create your first case to start practicing your legal skills</p>
                        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
                            Create Your First Case
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {cases.map((c) => (
                            <div key={c.id} className="card case-card">
                                <div className="case-header">
                                    <div className="case-icon">⚖️</div>
                                    <span className="case-id">#{c.id.toString().slice(-6)}</span>
                                </div>
                                <h3 className="case-title">{c.title}</h3>
                                <div className="case-file">
                                    <span>📄</span>
                                    <span>{c.fileName}</span>
                                </div>
                                <div className="case-actions">
                                    <button
                                        onClick={() => generateStrategy(c)}
                                        className="btn btn-secondary strategy-btn"
                                        title="Generate AI Strategy"
                                    >
                                        🧠 AI Strategy
                                    </button>
                                    <Link to={`/courtroom/${c.id}`} className="btn btn-primary case-btn">
                                        Enter Courtroom
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowUploadModal(false)}>✕</button>
                        <div className="modal-header">
                            <div className="modal-icon">📤</div>
                            <h3>Upload Case File</h3>
                            <p>Add a new case to your docket</p>
                        </div>
                        <form onSubmit={handleFileUpload} className="modal-form">
                            <div className="form-group">
                                <label>Case Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., State vs. Smith"
                                    value={newCaseTitle}
                                    onChange={(e) => setNewCaseTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Evidence File</label>
                                <div className={`file-upload ${selectedFile ? 'has-file' : ''}`}>
                                    <input
                                        type="file"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        required
                                    />
                                    {selectedFile ? (
                                        <div className="file-selected">
                                            <span>✓</span>
                                            <span>{selectedFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="file-placeholder">
                                            <div className="upload-icon">☁️</div>
                                            <p><strong>Click to upload</strong></p>
                                            <p className="file-hint">PDF or DOCX files</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Create Case
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Strategy Modal */}
            {showStrategyModal && (
                <div className="modal-overlay strategy-overlay" onClick={() => setShowStrategyModal(false)}>
                    <div className="modal strategy-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowStrategyModal(false)}>✕</button>
                        <div className="strategy-header">
                            <div className="strategy-icon">🧠</div>
                            <div>
                                <h3>AI Legal Strategist</h3>
                                <p className="strategy-subtitle">Analyzing: {selectedCaseForStrategy?.title}</p>
                            </div>
                        </div>

                        {strategyLoading ? (
                            <div className="strategy-loading">
                                <div className="matrix-loader"></div>
                                <p>Analyzing Precedents...</p>
                                <p className="loading-sub">Identifying Loopholes...</p>
                            </div>
                        ) : activeStrategy ? (
                            <div className="strategy-content">
                                <div className="strategy-grid">
                                    <div className="strategy-card core-issue">
                                        <h4>🎯 The Core Issue</h4>
                                        <p>{activeStrategy.coreIssue}</p>
                                    </div>

                                    <div className="strategy-card probability">
                                        <h4>📊 Success Probability</h4>
                                        <div className="prob-meter">
                                            <div className="prob-fill" style={{ width: `${activeStrategy.probabilityOfSuccess}%` }}></div>
                                        </div>
                                        <span className="prob-value">{activeStrategy.probabilityOfSuccess}%</span>
                                    </div>

                                    <div className="strategy-card winning-path">
                                        <h4>🏆 Winning Argument</h4>
                                        <p>{activeStrategy.winningPath}</p>
                                    </div>

                                    <div className="strategy-card weakness">
                                        <h4>⚠️ Opponent's Weakness</h4>
                                        <p>{activeStrategy.opponentWeakness}</p>
                                    </div>
                                </div>

                                <div className="precedents-section">
                                    <h4>📚 Key Precedents</h4>
                                    <div className="precedents-list">
                                        {activeStrategy.precedents.map((p, i) => (
                                            <div key={i} className="precedent-item">
                                                <span className="precedent-name">{p.name}</span>
                                                <span className="precedent-desc">{p.relevance}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
