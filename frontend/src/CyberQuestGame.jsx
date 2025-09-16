import React, { useEffect, useRef, useState } from 'react';
import { Shield, Wifi, Lock, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import './GamePage.css';

const CyberQuestGame = () => {
  const canvasRef = useRef();
  const [gameState, setGameState] = useState('menu');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [showExitQuestion, setShowExitQuestion] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [atExit, setAtExit] = useState(false);

  const gameRef = useRef({
    player: { x: 50, y: 350, width: 30, height: 30, speed: 4 },
    coins: [],
    exitGate: { x: 720, y: 320, width: 60, height: 80 },
    keys: {}
  });

  // Hint coins for each level - collectible information
  const levelHints = {
    1: [ // Network Security Basics
      { x: 150, y: 200, text: "💡 Firewalls act as digital barriers that monitor and control network traffic based on security rules.", collected: false },
      { x: 300, y: 250, text: "💡 Strong passwords should be at least 12 characters with uppercase, lowercase, numbers, and symbols.", collected: false },
      { x: 450, y: 180, text: "💡 WPA3 is the latest WiFi security protocol, much safer than older WEP or WPA2 standards.", collected: false },
      { x: 200, y: 350, text: "💡 Two-factor authentication (2FA) adds an extra security layer beyond just passwords.", collected: false },
      { x: 550, y: 300, text: "💡 Regular software updates patch security vulnerabilities that hackers could exploit.", collected: false },
      { x: 400, y: 100, text: "💡 VPNs encrypt your internet connection, making it safe to use public WiFi networks.", collected: false },
      { x: 100, y: 150, text: "💡 Network segmentation isolates different parts of a network to limit damage from breaches.", collected: false },
      { x: 650, y: 250, text: "💡 HTTPS websites encrypt data between your browser and the server for secure browsing.", collected: false }
    ],
    2: [ // Threat Detection & Response
      { x: 180, y: 180, text: "💡 Phishing emails often create urgency ('Act now!') and use fake sender addresses.", collected: false },
      { x: 320, y: 280, text: "💡 Malware symptoms include slow performance, pop-ups, and unknown programs running.", collected: false },
      { x: 480, y: 150, text: "💡 Social engineering manipulates people psychologically to reveal confidential information.", collected: false },
      { x: 250, y: 380, text: "💡 Ransomware encrypts your files and demands payment - good backups are the best defense.", collected: false },
      { x: 580, y: 320, text: "💡 Zero-day exploits target unknown vulnerabilities before patches are available.", collected: false },
      { x: 120, y: 300, text: "💡 DDoS attacks overwhelm servers with traffic from multiple sources to cause downtime.", collected: false },
      { x: 400, y: 200, text: "💡 Antivirus software uses signatures and behavior analysis to detect malicious programs.", collected: false },
      { x: 600, y: 180, text: "💡 Insider threats come from employees or contractors who abuse their authorized access.", collected: false }
    ],
    3: [ // Advanced Security Concepts
      { x: 160, y: 220, text: "💡 AES-256 encryption is military-grade security used to protect highly sensitive data.", collected: false },
      { x: 340, y: 160, text: "💡 The 3-2-1 backup rule: 3 copies, 2 different media types, 1 offsite location.", collected: false },
      { x: 500, y: 280, text: "💡 Zero Trust security assumes no user or device is trustworthy by default.", collected: false },
      { x: 220, y: 350, text: "💡 Least Privilege principle gives users only the minimum access needed for their job.", collected: false },
      { x: 580, y: 200, text: "💡 Incident response plans outline steps to contain, investigate, and recover from breaches.", collected: false },
      { x: 380, y: 120, text: "💡 Digital certificates verify website authenticity using public key cryptography.", collected: false },
      { x: 140, y: 120, text: "💡 Security audits regularly test systems and processes to find vulnerabilities.", collected: false },
      { x: 620, y: 350, text: "💡 Data Loss Prevention (DLP) tools monitor and protect sensitive information from theft.", collected: false }
    ]
  };

  // Exit gate questions for each level
  const exitQuestions = {
    1: {
      question: "What is the primary purpose of a firewall in network security?",
      options: [
        "A) Speed up internet connection",
        "B) Monitor and control network traffic",
        "C) Store user passwords",
        "D) Backup important files"
      ],
      correct: 1,
      explanation: "Firewalls monitor and control incoming and outgoing network traffic based on predetermined security rules."
    },
    2: {
      question: "What is the most effective way to protect against phishing attacks?",
      options: [
        "A) Use stronger antivirus software",
        "B) Enable firewall protection",
        "C) User awareness and training",
        "D) Update operating system regularly"
      ],
      correct: 2,
      explanation: "User awareness and training is the most effective defense against phishing since it helps people recognize and avoid social engineering attempts."
    },
    3: {
      question: "What does the 'Principle of Least Privilege' mean in cybersecurity?",
      options: [
        "A) Give everyone full access to simplify management",
        "B) Users get only minimum access needed for their role",
        "C) Only administrators can access the system",
        "D) Everyone has the same level of access"
      ],
      correct: 1,
      explanation: "Least Privilege means giving users, programs, and processes only the minimum levels of access needed to perform their authorized functions."
    }
  };

  const levelTitles = {
    1: 'Network Security Basics',
    2: 'Threat Detection & Response', 
    3: 'Advanced Security Concepts'
  };

  // Initialize coins for current level
  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.coins = levelHints[level].map(hint => ({...hint}));
      setCoinsCollected(0);
      setAtExit(false);
    }
  }, [level, gameState]);

  // Canvas game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const handleKeyDown = (e) => {
      gameRef.current.keys[e.key] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const updatePlayer = () => {
      const { player, keys } = gameRef.current;
      if (keys['ArrowRight'] || keys['d']) player.x = Math.min(player.x + player.speed, 800 - player.width);
      if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(player.x - player.speed, 0);
      if (keys['ArrowUp'] || keys['w']) player.y = Math.max(player.y - player.speed, 0);
      if (keys['ArrowDown'] || keys['s']) player.y = Math.min(player.y + player.speed, 500 - player.height);
    };

    const checkCoinCollection = () => {
      const { player, coins } = gameRef.current;
      coins.forEach((coin, index) => {
        if (!coin.collected) {
          const distance = Math.sqrt(
            Math.pow(player.x + player.width/2 - coin.x, 2) + 
            Math.pow(player.y + player.height/2 - coin.y, 2)
          );
          if (distance < 30) {
            coin.collected = true;
            setCoinsCollected(prev => prev + 1);
            setScore(prev => prev + 10);
            setCurrentHint(coin.text);
            setShowHint(true);
            setTimeout(() => setShowHint(false), 4000);
          }
        }
      });
    };

    const checkExitGate = () => {
      const { player, exitGate } = gameRef.current;
      const playerCenterX = player.x + player.width / 2;
      const playerCenterY = player.y + player.height / 2;
      
      const inExitZone = playerCenterX >= exitGate.x && 
                        playerCenterX <= exitGate.x + exitGate.width &&
                        playerCenterY >= exitGate.y &&
                        playerCenterY <= exitGate.y + exitGate.height;
      
      if (inExitZone && !atExit) {
        setAtExit(true);
        setShowExitQuestion(true);
      } else if (!inExitZone && atExit) {
        setAtExit(false);
        setShowExitQuestion(false);
      }
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 800, 500);
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, 500);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 500);

      // Grid pattern
      ctx.strokeStyle = '#0f3460';
      ctx.lineWidth = 1;
      for (let x = 0; x < 800; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 500);
        ctx.stroke();
      }
      for (let y = 0; y < 500; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // Draw platforms/obstacles
      ctx.fillStyle = '#34495e';
      ctx.fillRect(200, 400, 150, 20);
      ctx.fillRect(400, 350, 150, 20);
      ctx.fillRect(100, 300, 100, 20);
      ctx.fillRect(600, 380, 100, 20);
      ctx.fillRect(300, 200, 100, 20);
      ctx.fillRect(500, 150, 100, 20);

      // Draw hint coins
      gameRef.current.coins.forEach(coin => {
        if (!coin.collected) {
          // Coin glow effect
          const pulse = Math.sin(Date.now() * 0.01) * 3 + 3;
          ctx.fillStyle = '#f39c12';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 15 + pulse, 0, Math.PI * 2);
          ctx.fill();
          
          // Coin body
          ctx.fillStyle = '#f1c40f';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 12, 0, Math.PI * 2);
          ctx.fill();
          
          // Info icon
          ctx.fillStyle = '#2c3e50';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('i', coin.x, coin.y + 4);
        }
      });

      // Draw exit gate
      const { exitGate } = gameRef.current;
      ctx.fillStyle = atExit ? '#27ae60' : '#e74c3c';
      ctx.fillRect(exitGate.x, exitGate.y, exitGate.width, exitGate.height);
      
      // Gate decoration
      ctx.fillStyle = '#ecf0f1';
      ctx.fillRect(exitGate.x + 5, exitGate.y + 10, 50, 60);
      ctx.fillStyle = '#34495e';
      ctx.fillRect(exitGate.x + 20, exitGate.y + 25, 20, 30);
      
      // Exit text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('EXIT', exitGate.x + exitGate.width/2, exitGate.y + exitGate.height + 15);

      // Draw player
      ctx.fillStyle = '#3498db';
      ctx.fillRect(gameRef.current.player.x, gameRef.current.player.y, gameRef.current.player.width, gameRef.current.player.height);
      
      // Player eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(gameRef.current.player.x + 5, gameRef.current.player.y + 8, 6, 6);
      ctx.fillRect(gameRef.current.player.x + 19, gameRef.current.player.y + 8, 6, 6);
      
      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(10, 10, 780, 60);
      
      ctx.fillStyle = '#fff';
      ctx.font = '18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Level ${level}: ${levelTitles[level]}`, 20, 35);
      ctx.fillText(`Score: ${score}`, 20, 55);
      
      ctx.textAlign = 'center';
      ctx.fillText(`Hints Collected: ${coinsCollected}/${levelHints[level].length}`, 400, 35);
      
      ctx.textAlign = 'right';
      ctx.fillText('Use arrow keys to move', 780, 35);
      ctx.fillText('Collect hint coins and reach EXIT', 780, 55);

      updatePlayer();
      checkCoinCollection();
      checkExitGate();
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
  }, [gameState, level, score, coinsCollected, atExit]);

  const startLevel = (levelNum) => {
    setLevel(levelNum);
    setGameState('playing');
    setScore(0);
    setCoinsCollected(0);
    setShowExitQuestion(false);
    setAtExit(false);
    gameRef.current.player = { x: 50, y: 350, width: 30, height: 30, speed: 4 };
  };

  const handleExitQuestion = (answerIndex) => {
    const question = exitQuestions[level];
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 50);
      setFeedback(`✅ Correct! ${question.explanation}`);
      setShowFeedback(true);
      setShowExitQuestion(false);
      
      setTimeout(() => {
        setShowFeedback(false);
        if (level < 3) {
          setGameState('levelComplete');
        } else {
          setGameState('gameComplete');
        }
      }, 3000);
    } else {
      setFeedback(`❌ Incorrect. ${question.explanation} Try again!`);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  };

  const nextLevel = () => {
    if (level < 3) {
      startLevel(level + 1);
    } else {
      setGameState('menu');
    }
  };

  return (
    <div className="game-page">
      {/* Header */}
      <header>
        <h1>CYBER QUEST</h1>
        <Link to="/" className="btn secondary">← Home</Link>
      </header>

      <div className="game-content">
        <div className="game-container">
          
          {/* Menu State */}
          {gameState === 'menu' && (
            <div className="menu-section">
              <div className="section-container">
                <div className="menu-content">
                  <div className="game-header">
                    <Shield className="game-logo" />
                    <h2>CyberQuest Game</h2>
                    <p>Interactive Cybersecurity Learning Adventure</p>
                    <p className="game-instructions">Collect hint coins and answer the exit gate question to progress!</p>
                  </div>
                  
                  <div className="level-selection">
                    <button 
                      onClick={() => startLevel(1)}
                      className="level-btn level-1"
                    >
                      <div className="level-icon">🛡️</div>
                      <div className="level-info">
                        <h3>Level 1</h3>
                        <p>Network Security Basics</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => startLevel(2)}
                      className="level-btn level-2"
                    >
                      <div className="level-icon">⚠️</div>
                      <div className="level-info">
                        <h3>Level 2</h3>
                        <p>Threat Detection & Response</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => startLevel(3)}
                      className="level-btn level-3"
                    >
                      <div className="level-icon">🔐</div>
                      <div className="level-info">
                        <h3>Level 3</h3>
                        <p>Advanced Security Concepts</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Playing State */}
          {gameState === 'playing' && (
            <div className="game-section">
              <div className="canvas-container">
                <canvas 
                  ref={canvasRef} 
                  width={800} 
                  height={500}
                  className="game-canvas"
                />
                
                {/* Game Controls */}
                <div className="game-controls">
                  <button 
                    onClick={() => setGameState('menu')}
                    className="btn secondary"
                  >
                    ← Back to Menu
                  </button>
                </div>
                
                {/* Hint Display */}
                {showHint && (
                  <div className="hint-display">
                    <div className="hint-content">
                      <Info className="hint-icon" />
                      <p>{currentHint}</p>
                    </div>
                  </div>
                )}

                {/* Exit Question Modal */}
                {showExitQuestion && (
                  <div className="modal-overlay">
                    <div className="modal-content question-modal">
                      <div className="modal-header">
                        <Lock className="modal-icon" />
                        <h3>Exit Gate Challenge - Level {level}</h3>
                      </div>
                      
                      <div className="question-content">
                        <p className="question-text">{exitQuestions[level].question}</p>
                        
                        <div className="options-grid">
                          {exitQuestions[level].options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleExitQuestion(index)}
                              className="option-btn"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        
                        <p className="question-hint">
                          Answer correctly to proceed to the next level!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level Complete State */}
          {gameState === 'levelComplete' && (
            <div className="completion-section success">
              <div className="section-container">
                <div className="completion-content">
                  <CheckCircle className="completion-icon" />
                  <h2>Level {level} Complete!</h2>
                  <div className="completion-stats">
                    <p>Hints Collected: {coinsCollected}/{levelHints[level].length}</p>
                    <p>Score: {score} points</p>
                  </div>
                  <button 
                    onClick={nextLevel}
                    className="btn primary large"
                  >
                    Next Level
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game Complete State */}
          {gameState === 'gameComplete' && (
            <div className="completion-section final">
              <div className="section-container">
                <div className="completion-content">
                  <Lock className="completion-icon" />
                  <h2>🎉 Congratulations!</h2>
                  <p className="completion-subtitle">You've mastered CyberQuest!</p>
                  <p className="final-score">Final Score: {score} points</p>
                  
                  <div className="learning-summary">
                    <h3>Cybersecurity Knowledge Gained:</h3>
                    <ul>
                      <li>• Network security fundamentals and best practices</li>
                      <li>• Threat identification and response strategies</li>
                      <li>• Advanced security principles and implementation</li>
                      <li>• Real-world cybersecurity scenarios and solutions</li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => setGameState('menu')}
                    className="btn primary large"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="modal-overlay">
          <div className="modal-content feedback-modal">
            <p className="feedback-text">{feedback}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">X (Twitter)</a>
            <a href="mailto:xyz@aston.ac.uk">Contact Us</a>
            <Link to="/about">About Us</Link>
          </div>
          <p>© 2025 Cyber Defender Quest – Crafted for safer digital lives</p>
        </div>
      </footer>
    </div>
  );
};

export default CyberQuestGame;