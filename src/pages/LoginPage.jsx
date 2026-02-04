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

        // Simulate authentication
        setTimeout(() => {
            if (role === 'student') navigate('/student-dashboard');
            else if (role === 'judge') navigate('/judge-dashboard');
            else navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="modern-login-page">
            {/* Animated Background Gradient */}
            <div className="gradient-background">
                <div className="gradient-orb gradient-orb-1"></div>
                <div className="gradient-orb gradient-orb-2"></div>
                <div className="gradient-orb gradient-orb-3"></div>
            </div>

            {/* Main Container */}
            <div className="modern-login-container">
                {/* Left Side - Branding */}
                <div className="login-branding">
                    <div className="brand-logo">
                        <div className="logo-icon-modern">⚖️</div>
                        <h1 className="brand-title">
                            Moot Court
                            <span className="brand-subtitle">Simulator</span>
                        </h1>
                    </div>
                    <p className="brand-description">
                        Master the art of legal advocacy with AI-powered courtroom simulations,
                        real-time feedback, and immersive practice sessions.
                    </p>
                    <div className="features-list">
                        <div className="feature-item">
                            <span className="feature-icon">🎤</span>
                            <span>Voice Arguments</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🤖</span>
                            <span>AI Coaching</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🏆</span>
                            <span>Live Verdicts</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue your legal journey</p>
                        </div>

                        {/* Role Selector */}
                        <div className="modern-role-selector">
                            <button
                                type="button"
                                className={`modern-role-btn ${role === 'student' ? 'active' : ''}`}
                                onClick={() => setRole('student')}
                            >
                                <span className="role-emoji">👨‍🎓</span>
                                <span className="role-label">Student</span>
                            </button>
                            <button
                                type="button"
                                className={`modern-role-btn ${role === 'lawyer' ? 'active' : ''}`}
                                onClick={() => setRole('lawyer')}
                            >
                                <span className="role-emoji">⚖️</span>
                                <span className="role-label">Lawyer</span>
                            </button>
                            <button
                                type="button"
                                className={`modern-role-btn ${role === 'judge' ? 'active' : ''}`}
                                onClick={() => setRole('judge')}
                            >
                                <span className="role-emoji">👨‍⚖️</span>
                                <span className="role-label">Judge</span>
                            </button>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="modern-form">
                            <div className="form-group">
                                <label htmlFor="username">Username or Email</label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>

                            <button
                                type="submit"
                                className={`modern-submit-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <span className="arrow">→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="form-footer">
                            <p>
                                Don't have an account?{' '}
                                <a href="#" className="signup-link">Sign up now</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="decorative-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
};

export default LoginPage;
