import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CaseLibrary.css';

const CaseLibrary = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedCase, setSelectedCase] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const categories = ['All', 'Criminal Law', 'Constitutional Law', 'Contract Law', 'Tort Law', 'Corporate Law'];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchCases();
    }, []);

    useEffect(() => {
        filterCases();
    }, [searchTerm, selectedCategory, selectedDifficulty, cases]);

    const fetchCases = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/case-library');
            const data = await res.json();
            setCases(data);
            setFilteredCases(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch case library", err);
            setLoading(false);
        }
    };

    const filterCases = () => {
        let filtered = cases;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(c => c.category === selectedCategory);
        }

        // Filter by difficulty
        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
        }

        setFilteredCases(filtered);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return '#10b981';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Criminal Law': return '⚖️';
            case 'Constitutional Law': return '📜';
            case 'Contract Law': return '📝';
            case 'Tort Law': return '🛡️';
            case 'Corporate Law': return '🏢';
            default: return '📚';
        }
    };

    const viewCaseDetails = (caseItem) => {
        setSelectedCase(caseItem);
        setShowDetailsModal(true);
    };

    const useCaseTemplate = async (caseItem) => {
        try {
            const res = await fetch('http://localhost:4000/api/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: caseItem.title,
                    fileName: `${caseItem.id}.template`,
                    fileData: JSON.stringify(caseItem),
                    isTemplate: true,
                    templateId: caseItem.id
                })
            });

            if (res.ok) {
                const data = await res.json();
                navigate(`/courtroom/${data.case.id}`);
            }
        } catch (err) {
            console.error("Failed to create case from template", err);
        }
    };

    return (
        <div className="case-library-page">
            <div className="bg-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            <div className="container library-container">
                <header className="library-header">
                    <div>
                        <h2 className="gradient-text">Case Library</h2>
                        <p>Explore landmark cases and practice with real legal scenarios</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                        ← Back to Dashboard
                    </button>
                </header>

                {/* Search and Filters */}
                <div className="library-controls">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search cases, tags, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-section">
                            <label>Category</label>
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-section">
                            <label>Difficulty</label>
                            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                                {difficulties.map(diff => (
                                    <option key={diff} value={diff}>{diff}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-info">
                    <span>{filteredCases.length} {filteredCases.length === 1 ? 'case' : 'cases'} found</span>
                </div>

                {/* Cases Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                    </div>
                ) : filteredCases.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No Cases Found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {filteredCases.map((caseItem) => (
                            <div key={caseItem.id} className="card library-card">
                                <div className="case-header">
                                    <div className="case-icon">{getCategoryIcon(caseItem.category)}</div>
                                    <span
                                        className="difficulty-badge"
                                        style={{ backgroundColor: getDifficultyColor(caseItem.difficulty) }}
                                    >
                                        {caseItem.difficulty}
                                    </span>
                                </div>

                                <h3 className="case-title">{caseItem.title}</h3>
                                <div className="case-meta">
                                    <span className="case-year">📅 {caseItem.year}</span>
                                    <span className="case-jurisdiction">🌍 {caseItem.jurisdiction}</span>
                                </div>

                                <p className="case-description">{caseItem.shortDescription}</p>

                                <div className="case-tags">
                                    {caseItem.tags.slice(0, 3).map((tag, idx) => (
                                        <span key={idx} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <div className="case-actions">
                                    <button
                                        onClick={() => viewCaseDetails(caseItem)}
                                        className="btn btn-secondary"
                                    >
                                        📖 Details
                                    </button>
                                    <button
                                        onClick={() => useCaseTemplate(caseItem)}
                                        className="btn btn-primary"
                                    >
                                        ⚖️ Practice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Case Details Modal */}
            {showDetailsModal && selectedCase && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal details-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowDetailsModal(false)}>✕</button>

                        <div className="modal-header">
                            <div className="modal-icon">{getCategoryIcon(selectedCase.category)}</div>
                            <div>
                                <h3>{selectedCase.title}</h3>
                                <p className="case-subtitle">
                                    {selectedCase.year} • {selectedCase.jurisdiction} • {selectedCase.category}
                                </p>
                            </div>
                        </div>

                        <div className="details-content">
                            <section className="detail-section">
                                <h4>📋 Facts</h4>
                                <p>{selectedCase.facts}</p>
                            </section>

                            <section className="detail-section">
                                <h4>⚖️ Legal Issue</h4>
                                <p>{selectedCase.legalIssue}</p>
                            </section>

                            <section className="detail-section">
                                <h4>📚 Key Precedents</h4>
                                <div className="precedents-list">
                                    {selectedCase.precedents.map((p, idx) => (
                                        <div key={idx} className="precedent-item">
                                            <strong>{p.name}</strong>
                                            <span>{p.relevance}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="detail-section">
                                <h4>💬 Key Arguments</h4>
                                <div className="arguments-grid">
                                    <div className="argument-side">
                                        <h5>Petitioner/Plaintiff</h5>
                                        <ul>
                                            {selectedCase.keyArguments.petitioner.map((arg, idx) => (
                                                <li key={idx}>{arg}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="argument-side">
                                        <h5>Respondent/Defendant</h5>
                                        <ul>
                                            {selectedCase.keyArguments.respondent.map((arg, idx) => (
                                                <li key={idx}>{arg}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="detail-section">
                                <h4>🏛️ Outcome</h4>
                                <p>{selectedCase.outcome}</p>
                            </section>

                            <section className="detail-section">
                                <h4>❓ Practice Questions</h4>
                                <ul className="practice-questions">
                                    {selectedCase.practiceQuestions.map((q, idx) => (
                                        <li key={idx}>{q}</li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <div className="modal-footer">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    useCaseTemplate(selectedCase);
                                }}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                ⚖️ Start Practice Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseLibrary;
