import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Animated Background */}
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="container">
                    <div className="nav-content">
                        <div className="logo">
                            <div className="logo-icon">⚖️</div>
                            <span className="logo-text">MootCourt</span>
                        </div>
                        <Link to="/login" className="btn btn-secondary">Sign In</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="badge">
                            <span className="pulse-dot"></span>
                            <span>AI-Powered Legal Training</span>
                        </div>

                        <h1>
                            Master the Art of<br />
                            <span className="gradient-text">Legal Advocacy</span>
                        </h1>

                        <p className="hero-subtitle">
                            Experience realistic courtroom simulations with real-time AI feedback,
                            voice arguments, and live verdicts. Level up your legal skills like never before.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/login" className="btn btn-primary">
                                Start Your First Case
                                <span>→</span>
                            </Link>
                            <button className="btn btn-secondary">
                                <span>▶</span>
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="features grid grid-3">
                        <div className="card feature-card">
                            <div className="feature-icon purple">🎤</div>
                            <h3>Voice Arguments</h3>
                            <p>Speak your arguments naturally. Our AI transcribes and analyzes your delivery in real-time.</p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon cyan">⚡</div>
                            <h3>Real-Time Sync</h3>
                            <p>Multi-user courtrooms with instant updates. See arguments and verdicts as they happen.</p>
                        </div>

                        <div className="card feature-card">
                            <div className="feature-icon pink">🏆</div>
                            <h3>Live Verdicts</h3>
                            <p>Experience the thrill of real courtroom decisions with dramatic verdict announcements.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
