import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Reusing the main dashboard styles

const StudentDashboard = () => {
    const learningModules = [
        { id: 1, title: "The Art of Opening Statements", type: "Video", duration: "15 min", icon: "🎬" },
        { id: 2, title: "Mastering Cross-Examination", type: "Article", duration: "10 min", icon: "📖" },
        { id: 3, title: "Evidence 101: Admissibility", type: "Quiz", duration: "20 min", icon: "📝" },
        { id: 4, title: "Closing Arguments Workshop", type: "Interactive", duration: "30 min", icon: "🗣️" },
    ];

    return (
        <div className="dashboard-page">
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="container dashboard-container">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <div className="badge" style={{ marginBottom: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderColor: '#06b6d4' }}>
                            Student Portal
                        </div>
                        <h2 className="gradient-text">Learning Center</h2>
                        <p>Master the law through interactive modules and practice simulations.</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar-circle">S</div>
                    </div>
                </header>

                {/* Learning Grid */}
                <h3 style={{ marginBottom: '20px' }}>📚 Recommended Modules</h3>
                <div className="grid grid-3" style={{ marginBottom: '60px' }}>
                    {learningModules.map((module) => (
                        <div key={module.id} className="card learning-card">
                            <div className="module-icon">{module.icon}</div>
                            <div className="module-info">
                                <h4>{module.title}</h4>
                                <div className="module-meta">
                                    <span>{module.type}</span>
                                    <span>•</span>
                                    <span>{module.duration}</span>
                                </div>
                            </div>
                            <Link to={`/learning/${module.id}`} className="btn btn-secondary" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
                                Start Learning
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Practice Section */}
                <h3 style={{ marginBottom: '20px' }}>⚔️ Practice Court</h3>
                <div className="card practice-banner">
                    <div className="practice-content">
                        <h3>Mock Trial Simulator</h3>
                        <p>Test your skills in a risk-free environment with AI opponents.</p>
                        <Link to="/courtroom/practice" className="btn btn-primary">
                            Enter Practice Court
                        </Link>
                    </div>
                    <div className="practice-icon">⚖️</div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
