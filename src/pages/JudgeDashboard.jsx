import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const JudgeDashboard = () => {
    const [cases, setCases] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/cases')
            .then(res => res.json())
            .then(data => setCases(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="dashboard-page">
            <div className="bg-orbs">
                <div className="orb orb-1" style={{ background: '#f59e0b' }}></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="container dashboard-container">
                <header className="dashboard-header">
                    <div>
                        <div className="badge" style={{ marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' }}>
                            Judicial Chambers
                        </div>
                        <h2 className="gradient-text" style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
                            Court Docket
                        </h2>
                        <p>Review pending cases and preside over hearings.</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar-circle" style={{ background: '#f59e0b' }}>J</div>
                    </div>
                </header>

                <div className="grid grid-3">
                    {cases.map((c) => (
                        <div key={c.id} className="card case-card" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                            <div className="case-header">
                                <div className="case-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}>
                                    ⚖️
                                </div>
                                <span className="case-id">#{c.id.toString().slice(-6)}</span>
                            </div>
                            <h3 className="case-title">{c.title}</h3>
                            <div className="case-file">
                                <span>📄</span>
                                <span>{c.fileName}</span>
                            </div>

                            <div className="case-actions">
                                <Link
                                    to={`/courtroom/${c.id}`}
                                    className="btn btn-primary case-btn"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' }}
                                >
                                    Preside Over Case
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JudgeDashboard;
