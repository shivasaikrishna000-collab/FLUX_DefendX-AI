document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const threatInput = document.getElementById('threatInput');
    
    // States
    const initialState = document.getElementById('initialState');
    const loadingState = document.getElementById('loadingState');
    const resultState = document.getElementById('resultState');
    
    // Result Elements
    const resThreatType = document.getElementById('resThreatType');
    const resRiskLevelBadge = document.getElementById('resRiskLevelBadge');
    const resScore = document.getElementById('resScore');
    const resScoreBar = document.getElementById('resScoreBar');
    const resScoreGlow = document.getElementById('resScoreGlow');
    const resExplanation = document.getElementById('resExplanation');
    const resHighlightedText = document.getElementById('resHighlightedText');

    analyzeBtn.addEventListener('click', async () => {
        const text = threatInput.value.trim();
        if (!text) {
            alert('Please enter some text or a URL to analyze.');
            return;
        }

        // Show loading
        initialState.classList.add('hidden');
        resultState.classList.add('hidden');
        loadingState.classList.remove('hidden');
        analyzeBtn.disabled = true;
        analyzeBtn.classList.add('opacity-70', 'cursor-not-allowed');

        try {
            // Simulated network delay for effect (1.5 seconds)
            await new Promise(r => setTimeout(r, 1500));

            // Call Backend API
            const response = await fetch('http://localhost:3000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();
            
            // Populate Results
            resThreatType.textContent = data.threatType;
            resRiskLevelBadge.textContent = data.riskLevel;
            resScore.textContent = data.score;
            resExplanation.textContent = data.explanation;

            // Handle Styling based on risk level
            let badgeBg, badgeText, badgeBorder, barGradient, glowColor;
            
            if (data.riskLevel.includes('Dangerous')) {
                badgeBg = 'bg-red-500/20'; badgeText = 'text-red-400'; badgeBorder = 'border-red-500/30';
                barGradient = 'from-red-600 to-red-400';
                glowColor = 'bg-red-500/20';
            } else if (data.riskLevel.includes('Suspicious')) {
                badgeBg = 'bg-yellow-500/20'; badgeText = 'text-yellow-400'; badgeBorder = 'border-yellow-500/30';
                barGradient = 'from-orange-500 to-yellow-400';
                glowColor = 'bg-yellow-500/20';
            } else {
                badgeBg = 'bg-green-500/20'; badgeText = 'text-green-400'; badgeBorder = 'border-green-500/30';
                barGradient = 'from-green-500 to-emerald-400';
                glowColor = 'bg-green-500/20';
            }

            resRiskLevelBadge.className = `px-3 py-1 rounded-full ${badgeBg} ${badgeText} border ${badgeBorder} text-sm font-semibold flex items-center gap-1`;
            resScoreBar.className = `h-2 rounded-full bg-gradient-to-r ${barGradient} transition-all duration-1000 ease-out`;
            resScoreBar.style.width = '0%'; // start at 0 for animation
            
            setTimeout(() => {
                resScoreBar.style.width = data.score;
            }, 100);

            resScoreGlow.className = `absolute right-0 bottom-0 w-32 h-32 rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2 ${glowColor}`;

            // Highlight explainable AI text
            let highlightedHtml = escapeHtml(text);
            if (data.matchedKeywords && data.matchedKeywords.length > 0) {
                data.matchedKeywords.forEach(kw => {
                    const regex = new RegExp(`(${escapeRegExp(kw)})`, 'gi');
                    highlightedHtml = highlightedHtml.replace(regex, '<span class="highlight-danger">$1</span>');
                });
            }
            resHighlightedText.innerHTML = highlightedHtml;

            // Show Result
            loadingState.classList.add('hidden');
            resultState.classList.remove('hidden');

        } catch (error) {
            console.error(error);
            alert('An error occurred while analyzing. Please make sure the backend server is running.');
            loadingState.classList.add('hidden');
            initialState.classList.remove('hidden');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    });

    // Utility functions to prevent XSS while highlighting
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
});
