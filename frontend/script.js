document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const threatInput = document.getElementById('threatInput');
    const errorMsg = document.getElementById('inputErrorMsg');

    // Disable button when input is empty
    const updateBtnState = () => {
        const isEmpty = threatInput.value.trim() === '';
        analyzeBtn.disabled = isEmpty;
        analyzeBtn.classList.toggle('opacity-50', isEmpty);
        analyzeBtn.classList.toggle('cursor-not-allowed', isEmpty);
        analyzeBtn.classList.toggle('hover:-translate-y-0.5', !isEmpty);
        if (!isEmpty) errorMsg.classList.add('hidden');
    };
    threatInput.addEventListener('input', updateBtnState);
    updateBtnState(); // run on load
    
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

    // History Elements
    const historyList = document.getElementById('historyList');
    const emptyHistory = document.getElementById('emptyHistory');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const HISTORY_KEY = 'defendx_history';

    const urlAnalysisSection = document.getElementById('urlAnalysisSection');
    const urlCheckList = document.getElementById('urlCheckList');

    const isURL = (text) => {
        const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        const hasProtocol = text.includes('http://') || text.includes('https://');
        const hasDomainPattern = /\.[a-z]{2,6}/i.test(text);
        return pattern.test(text) || (hasProtocol && hasDomainPattern);
    };

    const analyzeURL = (url) => {
        const checks = [];
        const lowerUrl = url.toLowerCase();

        // Protocol Check
        if (lowerUrl.startsWith('https://')) {
            checks.push({ label: 'Protocol', value: 'Secure (HTTPS)', status: 'safe', icon: '✅' });
        } else if (lowerUrl.startsWith('http://')) {
            checks.push({ label: 'Protocol', value: 'Not Secure (HTTP)', status: 'risky', icon: '❌' });
        } else {
            checks.push({ label: 'Protocol', value: 'Missing/Insecure', status: 'suspicious', icon: '⚠️' });
        }

        // Domain Logic
        try {
            const domain = url.replace('https://', '').replace('http://', '').split('/')[0].split('?')[0];
            
            if (domain.length > 50) {
                checks.push({ label: 'Domain Length', value: 'Suspiciously Long', status: 'suspicious', icon: '⚠️' });
            }

            const subdomains = domain.split('.').length - 2;
            if (subdomains > 2) {
                checks.push({ label: 'Subdomains', value: `${subdomains + 2} Levels`, status: 'suspicious', icon: '⚠️' });
            }
            
            if ((domain.match(/-/g) || []).length > 3) {
                checks.push({ label: 'Structure', value: 'Excessive Hyphens', status: 'suspicious', icon: '⚠️' });
            }

            if (/\d/.test(domain) && !domain.split('.').every(part => /^\d+$/.test(part))) {
                checks.push({ label: 'Domain Content', value: 'Numbers detected', status: 'suspicious', icon: '⚠️' });
            }
        } catch (e) {}

        const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'owl.li'];
        if (shorteners.some(s => lowerUrl.includes(s))) {
            checks.push({ label: 'URL Type', value: 'Shortened URL', status: 'suspicious', icon: '⚠️' });
        }

        return checks;
    };

    const renderURLAnalysis = (checks) => {
        urlCheckList.innerHTML = '';
        if (checks.length === 0) {
            urlAnalysisSection.classList.add('hidden');
            return;
        }

        checks.forEach(check => {
            const div = document.createElement('div');
            let bgClass = 'bg-green-500/10 border-green-500/20 text-green-400';
            if (check.status === 'suspicious') bgClass = 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            if (check.status === 'risky') bgClass = 'bg-red-500/10 border-red-500/20 text-red-400';

            div.className = `flex justify-between items-center p-2.5 rounded-xl border ${bgClass} text-[11px] font-mono`;
            div.innerHTML = `
                <span class="opacity-70 font-sans uppercase tracking-tighter">${check.label}</span>
                <span class="flex items-center gap-1 font-bold">${check.icon} ${check.value}</span>
            `;
            urlCheckList.appendChild(div);
        });
        urlAnalysisSection.classList.remove('hidden');
    };

    const updateUI = (data, text) => {
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
            const highlightClass = data.riskLevel.includes('Dangerous') ? 'highlight-danger' : 'highlight-warning';
            data.matchedKeywords.forEach(kw => {
                const regex = new RegExp(`(${escapeRegExp(kw)})`, 'gi');
                highlightedHtml = highlightedHtml.replace(regex, `<span class="${highlightClass}">$1</span>`);
            });
        }
        resHighlightedText.innerHTML = highlightedHtml;

        // Smart URL Analysis Integration
        if (isURL(text)) {
            const urlChecks = analyzeURL(text);
            renderURLAnalysis(urlChecks);
        } else {
            urlAnalysisSection.classList.add('hidden');
        }

        // Show Result
        loadingState.classList.add('hidden');
        initialState.classList.add('hidden');
        resultState.classList.remove('hidden');
    };

    const saveToHistory = (text, data) => {
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const newItem = {
            text: text,
            threatType: data.threatType,
            riskLevel: data.riskLevel,
            score: data.score,
            explanation: data.explanation,
            matchedKeywords: data.matchedKeywords,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        // Avoid duplicates (simple check)
        history = history.filter(item => item.text !== text);
        history.unshift(newItem);
        history = history.slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    };

    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        if (history.length === 0) {
            emptyHistory.classList.remove('hidden');
            historyList.innerHTML = '';
            historyList.appendChild(emptyHistory);
            return;
        }
        emptyHistory.classList.add('hidden');
        historyList.innerHTML = '';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'bg-cyber-900 border border-gray-700/50 rounded-xl p-3 hover:border-blue-500/50 cursor-pointer transition-all group fade-in';
            
            let colorClass = 'text-green-400';
            if (item.riskLevel.includes('Dangerous')) colorClass = 'text-red-400';
            else if (item.riskLevel.includes('Suspicious')) colorClass = 'text-yellow-400';

            const preview = item.text.length > 50 ? item.text.substring(0, 50) + '...' : item.text;

            div.innerHTML = `
                <div class="flex justify-between items-start mb-1">
                    <span class="text-[10px] font-bold ${colorClass} uppercase tracking-tight">${item.riskLevel.split(' ')[1]}</span>
                    <span class="text-[9px] text-gray-500 uppercase">${item.timestamp}</span>
                </div>
                <p class="text-xs text-gray-400 truncate group-hover:text-gray-200">${escapeHtml(preview)}</p>
            `;
            div.onclick = () => {
                threatInput.value = item.text;
                updateBtnState();
                updateUI(item, item.text);
            };
            historyList.appendChild(div);
        });
    };

    clearHistoryBtn.onclick = () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    };

    // Load history on start
    renderHistory();

    analyzeBtn.addEventListener('click', async () => {
        const text = threatInput.value.trim();
        if (!text) {
            errorMsg.classList.remove('hidden');
            threatInput.focus();
            return;
        }
        errorMsg.classList.add('hidden');

        // Clear previous results & show loading
        resThreatType.textContent = '';
        resRiskLevelBadge.textContent = '';
        resScore.textContent = '';
        resExplanation.textContent = '';
        resHighlightedText.innerHTML = '';
        resScoreBar.style.width = '0%';
        urlAnalysisSection.classList.add('hidden');

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
            
            updateUI(data, text);
            saveToHistory(text, data);

        } catch (error) {
            console.error(error);
            loadingState.classList.add('hidden');
            // Show error inside result panel
            resThreatType.textContent = 'Error';
            resRiskLevelBadge.textContent = '⚠️ Unavailable';
            resRiskLevelBadge.className = 'px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 text-sm font-semibold flex items-center gap-1';
            resScore.textContent = '--';
            resExplanation.textContent = 'Could not reach the backend server. Please ensure it is running on port 3000.';
            resHighlightedText.innerHTML = '<span class="text-gray-500 italic">No context available.</span>';
            resultState.classList.remove('hidden');
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            updateBtnState();
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
