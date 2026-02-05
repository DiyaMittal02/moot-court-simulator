// ---------------------------------------------------------------
// server/gemini-service.js
// Google Gemini AI Integration for Moot Court Analysis
// ---------------------------------------------------------------

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI = null;
let model = null;

// Initialize the AI model
export const initializeGemini = () => {
    if (!GEMINI_API_KEY) {
        console.warn('⚠️  No GEMINI_API_KEY found. AI features will use fallback responses.');
        return false;
    }

    try {
        genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('✅ Gemini AI initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Gemini:', error);
        return false;
    }
};

/**
 * Analyze a legal argument using Gemini AI
 * @param {string} argument - The legal argument text to analyze
 * @returns {Promise<Object>} Analysis with score, strengths, improvements, and suggestions
 */
export const analyzeArgument = async (argument) => {
    // If AI not available, return fallback
    if (!model) {
        return getFallbackAnalysis(argument);
    }

    try {
        const prompt = `You are an expert legal coach analyzing a moot court argument. 

Analyze the following legal argument and provide structured feedback:

ARGUMENT:
"${argument}"

Please provide your analysis in the following JSON format:
{
  "score": <number from 0-100>,
  "strengths": [<array of 2-3 specific strengths>],
  "improvements": [<array of 2-3 specific areas to improve>],
  "suggestion": "<one actionable suggestion for improvement>"
}

Evaluate based on:
1. Legal reasoning and logic
2. Use of evidence and precedents (if any)
3. Clarity and persuasiveness
4. Structure and organization
5. Professional language

Return ONLY valid JSON, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            return {
                score: Math.min(100, Math.max(0, analysis.score || 50)),
                strengths: analysis.strengths || ['Professional presentation'],
                improvements: analysis.improvements || ['Consider adding more detail'],
                suggestion: analysis.suggestion || 'Practice citing relevant case law to strengthen your arguments.'
            };
        }

        // If JSON parsing fails, return fallback
        return getFallbackAnalysis(argument);

    } catch (error) {
        console.error('Error analyzing argument with Gemini:', error);
        return getFallbackAnalysis(argument);
    }
};

/**
 * Generate legal strategy for a case using Gemini AI
 * @param {string} caseTitle - The title of the case
 * @param {string} caseDescription - Optional case description or details
 * @returns {Promise<Object>} Strategy with core issue, winning path, precedents, etc.
 */
export const generateStrategy = async (caseTitle, caseDescription = '') => {
    // If AI not available, return fallback
    if (!model) {
        return getFallbackStrategy(caseTitle);
    }

    try {
        const prompt = `You are an expert legal strategist for moot court competitions.

Generate a strategic analysis for the following case:

CASE TITLE: ${caseTitle}
${caseDescription ? `CASE DETAILS: ${caseDescription}` : ''}

Provide your strategic analysis in the following JSON format:
{
  "coreIssue": "<brief description of the central legal question>",
  "probabilityOfSuccess": <number from 0-100>,
  "winningPath": "<strategy description for winning this case>",
  "opponentWeakness": "<potential weaknesses in the opposing argument>",
  "precedents": [
    {
      "name": "<relevant case name>",
      "relevance": "<how it applies to this case>"
    }
  ]
}

Focus on practical moot court strategy. Return ONLY valid JSON, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const strategy = JSON.parse(jsonMatch[0]);
            return {
                coreIssue: strategy.coreIssue || 'Identify the central legal question in this case',
                probabilityOfSuccess: Math.min(100, Math.max(0, strategy.probabilityOfSuccess || 65)),
                winningPath: strategy.winningPath || 'Build strong factual foundation and cite relevant precedents',
                opponentWeakness: strategy.opponentWeakness || 'Look for gaps in their evidence and reasoning',
                precedents: strategy.precedents || [
                    { name: 'Relevant Case Law', relevance: 'Supports your legal theory' }
                ]
            };
        }

        return getFallbackStrategy(caseTitle);

    } catch (error) {
        console.error('Error generating strategy with Gemini:', error);
        return getFallbackStrategy(caseTitle);
    }
};

/**
 * Fallback analysis when AI is not available
 */
const getFallbackAnalysis = (argument) => {
    const length = argument.length;
    const wordCount = argument.split(/\s+/).length;

    // Basic scoring based on argument characteristics
    let score = 50; // Base score

    // Length bonus (optimal around 150-300 words)
    if (wordCount >= 100 && wordCount <= 400) score += 15;
    else if (wordCount > 50 && wordCount < 100) score += 5;

    // Check for legal keywords
    const legalKeywords = ['pursuant', 'therefore', 'precedent', 'case', 'court', 'ruling', 'evidence', 'constitutional', 'statute'];
    const keywordMatches = legalKeywords.filter(kw => argument.toLowerCase().includes(kw)).length;
    score += keywordMatches * 3;

    // Structure check (paragraphs, sentences)
    const sentences = argument.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    if (sentences >= 3 && sentences <= 10) score += 10;

    // Cap score at 100
    score = Math.min(100, score);

    return {
        score,
        strengths: [
            wordCount > 100 ? 'Good level of detail in argument' : 'Clear and concise presentation',
            'Professional courtroom language',
            sentences > 3 ? 'Well-structured argument' : 'Direct communication'
        ],
        improvements: [
            keywordMatches < 2 ? 'Incorporate more legal terminology and precedents' : 'Consider strengthening evidence citations',
            wordCount < 100 ? 'Expand on key points with more detail' : 'Ensure all points directly support your conclusion',
            'Practice delivery for maximum impact'
        ],
        suggestion: 'Consider citing specific case law or constitutional provisions to strengthen your legal foundation.'
    };
};

/**
 * Fallback strategy when AI is not available
 */
const getFallbackStrategy = (caseTitle) => {
    // Check if it's one of the known landmark cases
    const knownCases = {
        'Miranda v. Arizona': {
            coreIssue: 'Whether custodial interrogation requires constitutional warnings',
            probabilityOfSuccess: 75,
            winningPath: 'Focus on the coercive nature of custodial interrogation and the need for procedural safeguards to protect Fifth Amendment rights',
            opponentWeakness: 'Difficulty proving confession was truly voluntary without clear safeguards',
            precedents: [
                { name: 'Escobedo v. Illinois', relevance: 'Established right to counsel during interrogation' },
                { name: 'Gideon v. Wainwright', relevance: 'Right to counsel is fundamental' }
            ]
        },
        'Brown v. Board of Education': {
            coreIssue: 'Whether racial segregation in public schools violates Equal Protection',
            probabilityOfSuccess: 85,
            winningPath: 'Demonstrate that separate facilities are inherently unequal and cause psychological harm',
            opponentWeakness: 'Cannot prove separate facilities are truly equal in all respects',
            precedents: [
                { name: 'Plessy v. Ferguson', relevance: 'Overturning the "separate but equal" doctrine' },
                { name: 'Sweatt v. Painter', relevance: 'Found inequality in segregated professional schools' }
            ]
        }
    };

    return knownCases[caseTitle] || {
        coreIssue: 'Identify the central legal question at stake in this case',
        probabilityOfSuccess: 65,
        winningPath: 'Build a strong factual foundation, cite relevant precedents, and demonstrate how the law supports your position',
        opponentWeakness: 'Look for gaps in their evidence and inconsistencies in their legal reasoning',
        precedents: [
            { name: 'Relevant Case Law 1', relevance: 'Supports your legal theory' },
            { name: 'Relevant Case Law 2', relevance: 'Distinguishes opponent\'s arguments' }
        ]
    };
};

export default {
    initializeGemini,
    analyzeArgument,
    generateStrategy
};
