import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/leaderboard');
            const data = await res.json();
            setLeaders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
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
                        <div className="badge" style={{ marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' }}>
                            🏆 Hall of Fame
                        </div>
                        <h2 className="gradient-text">Leaderboard</h2>
                        <p>Top performers across all courtroom battles</p>
                    </div>
                    <Link to="/dashboard" className="btn btn-secondary">← Back</Link>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <div className="leaderboard-table">
                        {leaders.map((leader, index) => (
                            <div key={leader.userId} className={`leaderboard-row rank-${index + 1}`}>
                                <div className="rank-badge">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                    {index > 2 && `#${index + 1}`}
                                </div>
                                <div className="leader-info">
                                    <h3>{leader.userName}</h3>
                                    <div className="leader-stats">
                                        <span>{leader.casesWon}W</span>
                                        <span>•</span>
                                        <span>{leader.casesLost}L</span>
                                    </div>
                                </div>
                                <div className="leader-score">
                                    <div className="score-value">{leader.score}</div>
                                    <div className="score-label">Points</div>
                                </div>
                            </div>
                        ))}

                        {leaders.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">🏆</div>
                                <h3>No Rankings Yet</h3>
                                <p>Be the first to compete and claim the top spot!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
