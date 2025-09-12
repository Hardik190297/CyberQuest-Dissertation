import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './GameLayout.css'; // Adjust path if necessary

const CoreConceptsGame = ({ username }) => {
  const canvasRef = useRef();
  const [gameState, setGameState] = useState(username ? 'menu' : 'login');
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastExplanation, setLastExplanation] = useState('');
  const [localUsername, setLocalUsername] = useState(username || '');

  const gameRef = useRef({
    player: { x: 50, y: 350, vy: 0, grounded: false, width: 30, height: 30 },
    platforms: [
      { x: 0, y: 450, w: 800, h: 50 },
      { x: 200, y: 350, w: 100, h: 20 },
      { x: 500, y: 280, w: 100, h: 20 },
      { x: 350, y: 200, w: 100, h: 20 },
      { x: 650, y: 320, w: 100, h: 20 }
    ],
    tokens: [
      { x: 250, y: 320, collected: false },
      { x: 550, y: 250, collected: false },
      { x: 400, y: 170, collected: false },
      { x: 700, y: 290, collected: false },
      { x: 120, y: 380, collected: false },
      { x: 320, y: 320, collected: false },
      { x: 580, y: 380, collected: false },
      { x: 450, y: 250, collected: false },
      { x: 680, y: 380, collected: false },
      { x: 750, y: 280, collected: false }
    ],
    gravity: 0.6,
    jumpForce: -15,
    moveSpeed: 4,
    keys: {}
  });

  const questions = {
    1: [
      { text: "What is the primary purpose of a firewall?", options: ["A) Encrypt data", "B) Block unauthorized access", "C) Store passwords", "D) Run applications"], answer: "B", explanation: "A firewall monitors and controls network traffic to block unauthorized access." },
      { text: "What does 'CIA Triad' stand for?", options: ["A) Confidentiality, Integrity, Availability", "B) Control, Identification, Access", "C) Cipher, Intrusion, Authentication", "D) Central, Integrity, Access"], answer: "A", explanation: "The CIA Triad is a security model focusing on Confidentiality, Integrity, and Availability." },
      { text: "Is a username part of authentication?", options: ["A) Yes", "B) No"], answer: "A", explanation: "A username is a key component of authentication when paired with a password." },
      { text: "What is the role of an antivirus?", options: ["A) Manage networks", "B) Detect and remove malware", "C) Encrypt files", "D) Backup data"], answer: "B", explanation: "An antivirus protects systems by detecting and removing malicious software." },
      { text: "Which term refers to protecting data from unauthorized disclosure?", options: ["A) Integrity", "B) Confidentiality", "C) Availability", "D) Authentication"], answer: "B", explanation: "Confidentiality ensures data is accessible only to authorized users." },
      { text: "What is a common use of a VPN?", options: ["A) Speed up browsing", "B) Secure remote access", "C) Store files", "D) Run servers"], answer: "B", explanation: "A VPN provides a secure connection for remote access over the internet." },
      { text: "Which protocol is used for secure web browsing?", options: ["A) HTTP", "B) FTP", "C) HTTPS", "D) SMTP"], answer: "C", explanation: "HTTPS uses encryption to secure data during web browsing." },
      { text: "What does 'patch management' involve?", options: ["A) Updating software to fix vulnerabilities", "B) Deleting old files", "C) Changing passwords", "D) Backing up data"], answer: "A", explanation: "Patch management updates software to address security vulnerabilities." },
      { text: "Is encryption reversible without a key?", options: ["A) Yes", "B) No"], answer: "B", explanation: "Encryption is reversible only with the correct key, ensuring security." },
      { text: "What is the first step in securing a device?", options: ["A) Install games", "B) Update software", "C) Delete files", "D) Ignore updates"], answer: "B", explanation: "Updating software is the first step to secure a device against known vulnerabilities." }
    ],
    2: [
      { text: "Which is a common phishing technique?", options: ["A) Encryption", "B) Spear Phishing", "C) Firewall Setup", "D) Data Backup"], answer: "B", explanation: "Spear phishing targets individuals with personalized emails to steal data." },
      { text: "What does DDoS stand for?", options: ["A) Distributed Denial of Service", "B) Data Defense Operating System", "C) Direct Data Storage", "D) Dynamic Domain Security"], answer: "A", explanation: "DDoS attacks overwhelm systems to disrupt service using multiple sources." },
      { text: "Which threat exploits software vulnerabilities?", options: ["A) Malware", "B) Phishing", "C) Social Engineering", "D) Insider Threat"], answer: "A", explanation: "Malware exploits software flaws to gain unauthorized access." },
      { text: "What is a key characteristic of ransomware?", options: ["A) Speeds up systems", "B) Encrypts data for ransom", "C) Deletes files", "D) Improves security"], answer: "B", explanation: "Ransomware locks data and demands payment for decryption." },
      { text: "Which attack involves tricking users into revealing credentials?", options: ["A) Brute Force", "B) Social Engineering", "C) Man-in-the-Middle", "D) SQL Injection"], answer: "B", explanation: "Social engineering manipulates users into disclosing sensitive information." },
      { text: "What does a zero-day exploit target?", options: ["A) Known vulnerabilities", "B) Unknown software flaws", "C) Old hardware", "D) Encrypted files"], answer: "B", explanation: "A zero-day exploit targets vulnerabilities unknown to developers." },
      { text: "Which threat involves unauthorized internal access?", options: ["A) External Hacking", "B) Insider Threat", "C) Phishing", "D) Malware"], answer: "B", explanation: "An insider threat arises from authorized users abusing access." },
      { text: "What is a common sign of a malware infection?", options: ["A) Faster performance", "B) Slow system response", "C) More storage", "D) Better security"], answer: "B", explanation: "Malware often slows systems due to unauthorized processes." },
      { text: "Which attack intercepts communication?", options: ["A) DDoS", "B) Man-in-the-Middle", "C) Phishing", "D) Brute Force"], answer: "B", explanation: "A Man-in-the-Middle attack intercepts and alters communication between parties." },
      { text: "What is a primary defense against SQL injection?", options: ["A) Encryption", "B) Input Validation", "C) Firewalls", "D) Backups"], answer: "B", explanation: "Input validation prevents malicious SQL code from executing." }
    ],
    3: [
      { text: "What is the main goal of encryption?", options: ["A) Speed up data transfer", "B) Protect data confidentiality", "C) Increase storage", "D) Enhance performance"], answer: "B", explanation: "Encryption secures data by making it unreadable without a key." },
      { text: "Which principle requires minimizing access rights?", options: ["A) Least Privilege", "B) Defense in Depth", "C) Zero Trust", "D) Segmentation"], answer: "A", explanation: "Least Privilege limits access to the minimum needed for tasks." },
      { text: "Is multi-factor authentication (MFA) more secure?", options: ["A) Yes", "B) No"], answer: "A", explanation: "MFA adds layers of verification, enhancing security over a single password." },
      { text: "What does 'Defense in Depth' mean?", options: ["A) Single security layer", "B) Multiple security layers", "C) No security", "D) Basic encryption"], answer: "B", explanation: "Defense in Depth uses multiple layers to protect systems." },
      { text: "Which model assumes no trust by default?", options: ["A) CIA Triad", "B) Zero Trust", "C) Least Privilege", "D) Segmentation"], answer: "B", explanation: "Zero Trust requires continuous verification, assuming no inherent trust." },
      { text: "What is a key benefit of segmentation?", options: ["A) Faster internet", "B) Limits attack spread", "C) More storage", "D) Better graphics"], answer: "B", explanation: "Segmentation divides networks to contain and limit attack spread." },
      { text: "Is hashing reversible?", options: ["A) Yes", "B) No"], answer: "B", explanation: "Hashing is a one-way function, designed to be irreversible for security." },
      { text: "What does 'end-to-end encryption' ensure?", options: ["A) Speed", "B) Privacy across all nodes", "C) Easy access", "D) Public visibility"], answer: "B", explanation: "End-to-end encryption ensures only sender and receiver can read data." },
      { text: "Which practice reduces insider threats?", options: ["A) Open access", "B) Regular audits", "C) No monitoring", "D) Shared passwords"], answer: "B", explanation: "Regular audits help detect and prevent insider threat activities." },
      { text: "What is a core aspect of incident response?", options: ["A) Ignoring alerts", "B) Rapid containment", "C) Delaying action", "D) Avoiding backups"], answer: "B", explanation: "Rapid containment minimizes damage during a security incident." }
    ]
  };

  const levelNames = { 1: "Core Concepts", 2: "Common Threats", 3: "Security Principles" };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const handleKeyDown = (e) => {
      gameRef.current.keys[e.key] = true;
      if (e.key === ' ') e.preventDefault();
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const checkCollision = (player, platform) => {
      return player.x < platform.x + platform.w &&
             player.x + player.width > platform.x &&
             player.y < platform.y + platform.h &&
             player.y + player.height > platform.y;
    };

    const updatePlayer = () => {
      const { player, platforms, gravity, jumpForce, moveSpeed, keys } = gameRef.current;
      if (keys['ArrowRight'] || keys['d']) player.x = Math.min(player.x + moveSpeed, 800 - player.width);
      if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(player.x - moveSpeed, 0);
      if ((keys[' '] || keys['ArrowUp'] || keys['w']) && player.grounded) {
        player.vy = jumpForce;
        player.grounded = false;
      }
      player.vy += gravity;
      player.y += player.vy;
      player.grounded = false;
      platforms.forEach(platform => {
        if (checkCollision(player, platform) && player.vy > 0 && player.y < platform.y) {
          player.y = platform.y - player.height;
          player.vy = 0;
          player.grounded = true;
        }
      });
      if (player.y + player.height >= 500) {
        player.y = 500 - player.height;
        player.vy = 0;
        player.grounded = true;
      }
    };

    const checkTokenCollection = () => {
      const { player, tokens } = gameRef.current;
      tokens.forEach((token, index) => {
        if (!token.collected) {
          const distance = Math.sqrt(Math.pow(player.x + player.width/2 - token.x, 2) + Math.pow(player.y + player.height/2 - token.y, 2));
          if (distance < 25) {
            token.collected = true;
            const newProgress = Math.min(progress + 10, 100);
            setProgress(newProgress);
            if (questionIndex < questions[level].length) setCurrentQuestion(questions[level][questionIndex]);
          }
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, 800, 500);
      const gradient = ctx.createLinearGradient(0, 0, 0, 500);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 500);

      if (gameState === 'playing') {
        ctx.fillStyle = '#8B4513';
        gameRef.current.platforms.forEach(platform => ctx.fillRect(platform.x, platform.y, platform.w, platform.h));
        gameRef.current.tokens.forEach(token => {
          if (!token.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(token.x, token.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(token.x - 3, token.y - 3, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(gameRef.current.player.x, gameRef.current.player.y, gameRef.current.player.width, gameRef.current.player.height);
        ctx.fillStyle = '#FFF';
        ctx.fillRect(gameRef.current.player.x + 5, gameRef.current.player.y + 5, 8, 8);
        ctx.fillRect(gameRef.current.player.x + 17, gameRef.current.player.y + 5, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(gameRef.current.player.x + 7, gameRef.current.player.y + 7, 4, 4);
        ctx.fillRect(gameRef.current.player.x + 19, gameRef.current.player.y + 7, 4, 4);
        updatePlayer();
        checkTokenCollection();
      }

      ctx.fillStyle = '#333';
      ctx.fillRect(10, 10, 780, 25);
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(12, 12, (776 * progress) / 100, 21);
      ctx.fillStyle = '#FFF';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${levelNames[level]} - Progress: ${progress}% - Score: ${score}`, 400, 28);

      if (gameState === 'playing') {
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Use Arrow Keys or WASD to move, Space/Up to jump', 10, 460);
        ctx.fillText('Collect all 10 golden tokens to answer questions!', 10, 480);
      }
    };

    const gameLoop = () => {
      draw();
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [gameState, level, progress, score, questionIndex, username]);

  useEffect(() => {
    if (localUsername && gameState === 'login') {
      axios.get(`http://localhost:5000/api/getScore/${localUsername}`)
        .then(response => {
          setScore(response.data.score || 0);
          setGameState('menu');
        })
        .catch(err => console.error('Login error:', err));
    }
  }, [localUsername, gameState]);

  const startGame = (newLevel) => {
    setLevel(newLevel);
    setGameState('playing');
    setProgress(0);
    setAttempts(3);
    setScore(0); // Reset score for new game
    setQuestionIndex(0);
    setCurrentQuestion(null);
    setShowExplanation(false);
    gameRef.current.player = { x: 50, y: 350, vy: 0, grounded: false, width: 30, height: 30 };
    gameRef.current.tokens.forEach(token => token.collected = false);
    saveScore(); // Save previous score before starting
  };

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;
    if (answer === currentQuestion.answer) {
      setScore(prev => prev + 10);
      setLastExplanation(`✅ Correct! ${currentQuestion.explanation}`);
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        setQuestionIndex(prev => prev + 1);
        setCurrentQuestion(null);
        setAttempts(3);
        if (questionIndex + 1 >= questions[level].length) {
          setTimeout(() => setGameState('end'), 500);
        }
      }, 2000);
    } else {
      setAttempts(prev => {
        const newAttempts = prev - 1;
        if (newAttempts <= 0) {
          setLastExplanation(`❌ Wrong! Correct answer: ${currentQuestion.answer}. ${currentQuestion.explanation}`);
          setShowExplanation(true);
          setTimeout(() => setGameState('end'), 3000);
        }
        return newAttempts;
      });
    }
    saveScore();
  };

  const restartGame = () => {
    setGameState('menu');
    setProgress(0);
    setAttempts(3);
    setScore(0);
    setQuestionIndex(0);
    setCurrentQuestion(null);
    setShowExplanation(false);
  };

  const saveScore = () => {
    if (localUsername) {
      axios.post('http://localhost:5000/api/saveScore', { username: localUsername, score })
        .catch(err => console.error('Score save error:', err));
    }
  };

  const handleLogin = (user) => {
    setLocalUsername(user);
    setGameState('menu');
  };

  return (
    <div className="game-container">
      <div className="game-wrapper">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Cybersecurity Adventure</h1>
        
        {gameState === 'login' && (
          <div className="menu-overlay">
            <div className="menu-content">
              <h2 className="text-5xl font-bold mb-6">Login</h2>
              <input
                type="text"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                placeholder="Enter username"
                className="w-80 p-3 mb-4 text-lg rounded-lg border border-gray-300"
              />
              <button
                onClick={() => handleLogin(localUsername)}
                className="w-80 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Start
              </button>
            </div>
          </div>
        )}

        {gameState === 'menu' && (
          <div className="menu-overlay">
            <div className="menu-content">
              <h2 className="text-5xl font-bold mb-10">Choose Your Level</h2>
              <div className="space-y-6">
                <button onClick={() => startGame(1)} className="block w-80 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  Level 1: Core Concepts
                </button>
                <button onClick={() => startGame(2)} className="block w-80 py-4 px-6 bg-green-600 hover:bg-green-700 text-white text-2xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  Level 2: Common Threats
                </button>
                <button onClick={() => startGame(3)} className="block w-80 py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white text-2xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                  Level 3: Security Principles
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="game-canvas">
          <canvas ref={canvasRef} width={800} height={500} className="block" />
          
          {gameState === 'end' && (
            <div className="end-overlay">
              <div className="end-content">
                <h2 className="text-5xl font-bold mb-6">{score >= 80 ? '🎉 Congratulations!' : 'Game Over'}</h2>
                <p className="text-3xl mb-4">Final Score: {score}/100</p>
                <p className="text-xl mb-8">{score >= 80 ? 'Excellent work! You\'re a cybersecurity expert!' : score >= 60 ? 'Good job! Keep learning to improve.' : 'Keep practicing! Cybersecurity takes time to master.'}</p>
                <div className="space-x-6">
                  <button onClick={restartGame} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                    Play Again
                  </button>
                  <button onClick={() => setGameState('menu')} className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white text-xl font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                    Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {currentQuestion && gameState === 'playing' && !showExplanation && (
          <div className="question-panel">
            <h3 className="text-2xl font-semibold mb-6 text-center text-blue-800">{currentQuestion.text}</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(String.fromCharCode(65 + index))} className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-lg font-medium transition-all duration-300 transform hover:scale-105">
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-lg text-gray-600">Attempts remaining: {attempts}</p>
          </div>
        )}

        {showExplanation && (
          <div className="explanation-panel">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-4">
                  {lastExplanation.includes('❌') ? <span className="text-red-600">Incorrect Answer</span> : lastExplanation.includes('✅') ? <span className="text-green-600">Correct Answer!</span> : lastExplanation.includes('🎉') ? <span className="text-blue-600">Level Complete!</span> : 'Feedback'}
                </h3>
                <p className="text-lg text-gray-800">{lastExplanation}</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="control-buttons">
            <button onClick={() => setGameState('menu')} className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
              Back to Menu
            </button>
            <button onClick={restartGame} className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
              Restart Level
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreConceptsGame;