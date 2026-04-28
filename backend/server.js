const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Detection Logic
const THREAT_RULES = [
    {
        type: 'Phishing',
        level: '🔴 Dangerous',
        scoreRange: [10, 30],
        keywords: ['urgent', 'verify', 'bank', 'password'],
        explanation: 'This message contains urgency-related keywords commonly used in phishing attacks.'
    },
    {
        type: 'Malware',
        level: '🔴 Dangerous',
        scoreRange: [5, 20],
        keywords: ['.exe', '.apk', 'download'],
        explanation: 'Suspicious file extensions or download prompts detected, indicating potential malware.'
    },
    {
        type: 'Scam/Spam',
        level: '🟡 Suspicious',
        scoreRange: [30, 50],
        keywords: ['win', 'lottery', 'prize', 'offer'],
        explanation: 'Keywords often associated with unsolicited spam or lottery scams were found.'
    },
    {
        type: 'Suspicious URL',
        level: '🟡 Suspicious',
        scoreRange: [40, 60],
        keywords: ['bit.ly', 'tinyurl'],
        explanation: 'URL shorteners are frequently used to hide malicious destinations.'
    }
];

app.post('/analyze', (req, res) => {
    const raw = req.body && req.body.text;
    const text = typeof raw === 'string' ? raw.trim() : '';

    if (!text) {
        return res.status(400).json({
            error: true,
            message: 'Text input is required and cannot be empty.'
        });
    }

    const lowerText = text.toLowerCase();
    let detectedThreat = null;
    let matchedKeywords = [];

    for (const rule of THREAT_RULES) {
        const found = rule.keywords.filter(kw => lowerText.includes(kw));
        if (found.length > 0) {
            detectedThreat = rule;
            matchedKeywords = found;
            break; // take the first matched rule
        }
    }

    if (detectedThreat) {
        // Random score within range
        const [min, max] = detectedThreat.scoreRange;
        const score = Math.floor(Math.random() * (max - min + 1)) + min;
        
        res.json({
            threatType: detectedThreat.type,
            riskLevel: detectedThreat.level,
            score: `${score}%`,
            explanation: detectedThreat.explanation,
            matchedKeywords: matchedKeywords
        });
    } else {
        // Safe
        const score = Math.floor(Math.random() * (20)) + 80; // 80-100
        res.json({
            threatType: 'Safe',
            riskLevel: '🟢 Safe',
            score: `${score}%`,
            explanation: 'No suspicious patterns or malicious keywords detected in the provided input.',
            matchedKeywords: []
        });
    }
});

app.listen(PORT, () => {
    console.log(`DefendX AI Backend running on http://localhost:${PORT}`);
});
