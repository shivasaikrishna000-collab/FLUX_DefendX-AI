# DefendX AI

**DefendX AI** is a cutting-edge cyber threat detection platform designed to protect users from phishing, malware, and online scams. Leveraging advanced Natural Language Processing (NLP) and machine learning, DefendX AI analyzes text content, URLs, and messages to identify malicious patterns and provide instant risk assessments.

## Features

- **Multi-Input Analysis**: Supports analysis of URLs, email content, and general text messages.
- **AI-Powered Detection**: Uses NLP models to detect phishing attempts, malware indicators, scam tactics, and deceptive language.
- **Risk Scoring System**: Provides an instant risk score (0-100) and clear risk level classification (Safe, Suspicious, Dangerous).
- **Explainable AI**: Offers detailed explanations for each detection, highlighting matched keywords and suspicious patterns.
- **Real-time Status**: Indicates active threat analysis with a live status indicator.
- **Dark Mode**: A sleek, modern dark theme optimized for security interfaces.

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI/ML**: spaCy (for NLP), scikit-learn (for classification)
- **Database**: SQLite (for local storage)

## Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- Python (v3.7 or higher recommended)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:3000`.

### Frontend Setup

1. Open `frontend/index.html` in your web browser.

## Usage

1. Open the frontend in your browser.
2. Enter a URL, email, or message into the text area.
3. Click "Analyze Threat".
4. View the AI-generated risk assessment and explanation.

## Project Structure

```
DefendX-AI/
├── backend/
│   ├── server.js          # Express server and API endpoints
│   ├── models.js          # AI models and NLP pipelines
│   └── threats.json       # Static dataset (can be expanded)
├── frontend/
│   ├── index.html         # Main UI page
│   ├── script.js          # Frontend logic and API calls
│   ├── styles.css         # Tailwind CSS
│   └── assets/            # Images and icons
└── README.md              # Project documentation
```

