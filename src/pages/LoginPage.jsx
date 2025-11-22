import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate biometric scan
        setTimeout(() => {
            if (role === 'student') navigate('/student-dashboard');
            else if (role === 'judge') navigate('/judge-dashboard');
            else navigate('/dashboard'); // Lawyer (default)
        }, 2000);
    };

    return (
        <div className="login-page">
            {/* Background Grid */}
            <div className="cyber-grid"></div>

            <div className="login-container">
                <div className="hologram-card">
                    <div className="card-header">
                        <div className="logo-glitch" data-text="MOOT COURT">MOOT COURT</div>
                        <p className="system-status">SYSTEM ONLINE // SECURE CONNECTION</p>
                    </div>

                    <div className="avatar-scanner">
                        <div className="scan-line"></div>
                        <div className="avatar-placeholder">👤</div>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="role-selector-login">
                            <button
                                type="button"
                                className={`role-option ${role === 'student' ? 'active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`role-option ${role === 'lawyer' ? 'active' : ''}`}
                                onClick={() => setRole('lawyer')}
                            >
                                Lawyer
                            </button>
                            <button
                                type="button"
                                className={`role-option ${role === 'judge' ? 'active' : ''}`}
                                onClick={() => setRole('judge')}
                            >
                                Judge
                            </button>
                        </div>

                        <div className="input-group">
                            <label>IDENTITY CODE</label>
                            <input type="text" placeholder="ENTER ID..." required />
                            <div className="input-border"></div>
                        </div>

                        <div className="input-group">
                            <label>ACCESS KEY</label>
                            <input type="password" placeholder="••••••••" required />
                            <div className="input-border"></div>
                        </div>

                        <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`}>
                            {loading ? 'AUTHENTICATING...' : 'INITIATE SESSION'}
                        </button>
                    </form>

                    <div className="card-footer">
                        <span>V.2.0.45</span>
                        <span>ENCRYPTED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
