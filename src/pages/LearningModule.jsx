import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Dashboard.css';

const LearningModule = () => {
    const { moduleId } = useParams();
    const [quizScore, setQuizScore] = useState(null);

    // Mock Content Database
    const modules = {
        1: {
            title: "The Art of Opening Statements",
            type: "Video",
            content: "https://www.youtube.com/embed/7qKcJF4fOPs", // Placeholder legal video
            description: "Learn how to captivate the judge from the very first sentence. This masterclass covers hooking your audience, outlining your roadmap, and establishing credibility."
        },
        2: {
            title: "Mastering Cross-Examination",
            type: "Article",
            content: `
        <h3>1. The Golden Rule</h3>
        <p>Never ask a question you don't know the answer to. Cross-examination is not a fishing expedition; it's a surgical strike.</p>
        
        <h3>2. Leading Questions Only</h3>
        <p>You are the star. The witness is just a prop. Ask questions that require a "Yes" or "No" answer.</p>
        
        <h3>3. Control the Pace</h3>
        <p>Don't let the witness explain. If they try to ramble, cut them off politely but firmly: "Thank you, Mr. Jones, that answers my question."</p>
      `,
            description: "A comprehensive guide to dismantling witness testimony without losing control of the courtroom."
        },
        3: {
            title: "Evidence 101: Admissibility",
            type: "Quiz",
            questions: [
                { q: "Hearsay is generally admissible in court.", a: false },
                { q: "Relevance is the primary threshold for all evidence.", a: true },
                { q: "Character evidence is always allowed to prove conduct.", a: false }
            ],
            description: "Test your knowledge on the Federal Rules of Evidence."
        },
        4: {
            title: "Closing Arguments Workshop",
            type: "Interactive",
            content: "Interactive Simulation Loading...",
            description: "Practice your closing argument in a simulated environment."
        }
    };

    const module = modules[moduleId] || modules[1];

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        // Mock scoring
        setQuizScore(100);
    };

    return (
        <div className="dashboard-page">
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="container dashboard-container">
                <Link to="/student-dashboard" className="btn btn-secondary" style={{ marginBottom: '24px' }}>
                    ← Back to Dashboard
                </Link>

                <div className="card" style={{ minHeight: '600px', padding: '40px' }}>
                    <div className="module-header" style={{ marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '24px' }}>
                        <div className="badge" style={{ marginBottom: '16px' }}>{module.type} Module</div>
                        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>{module.title}</h1>
                        <p style={{ color: '#9ca3af', fontSize: '18px' }}>{module.description}</p>
                    </div>

                    <div className="module-content">
                        {module.type === 'Video' && (
                            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px' }}>
                                <iframe
                                    src={module.content}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    title="Module Video"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        {module.type === 'Article' && (
                            <div className="article-content" dangerouslySetInnerHTML={{ __html: module.content }} style={{ lineHeight: '1.8', fontSize: '18px' }}></div>
                        )}

                        {module.type === 'Quiz' && (
                            <div className="quiz-container">
                                {quizScore !== null ? (
                                    <div className="quiz-result" style={{ textAlign: 'center', padding: '40px' }}>
                                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                                        <h2>Score: {quizScore}%</h2>
                                        <p>Excellent work! You've mastered the basics of Evidence.</p>
                                        <button onClick={() => setQuizScore(null)} className="btn btn-secondary" style={{ marginTop: '24px' }}>Retake Quiz</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleQuizSubmit}>
                                        {module.questions.map((q, i) => (
                                            <div key={i} className="quiz-question" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '16px' }}>{i + 1}. {q.q}</p>
                                                <div style={{ display: 'flex', gap: '16px' }}>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <input type="radio" name={`q${i}`} required /> True
                                                    </label>
                                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                        <input type="radio" name={`q${i}`} required /> False
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                        <button type="submit" className="btn btn-primary">Submit Answers</button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningModule;
