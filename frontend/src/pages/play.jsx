// frontend/src/pages/Play.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Play.css';

const questions = [
  {
    q: 'Is “password123” a safe password?',
    ans: false,
    detail: 'Too predictable—use 12+ mixed characters.'
  },
  {
    q: 'Should you enable 2-Factor Authentication when possible?',
    ans: true,
    detail: 'Adds an extra lock beyond your password.'
  },
  {
    q: 'Is it safe to click links in unexpected emails?',
    ans: false,
    detail: 'Could be phishing—verify the sender first.'
  },
  {
    q: 'Must you install software updates promptly?',
    ans: true,
    detail: 'Patches close security holes.'
  },
  {
    q: 'Is HTTPS (padlock) important when entering passwords?',
    ans: true,
    detail: 'Encrypts data in transit.'
  },
  {
    q: 'Should you reuse the same password everywhere?',
    ans: false,
    detail: 'One breach = all accounts at risk.'
  }
];

const steps = [
  { id: 0, name: 'Start' },
  { id: 1, name: 'Junction 1' },
  { id: 2, name: 'Junction 2' },
  { id: 3, name: 'Junction 3' },
  { id: 4, name: 'Junction 4' },
  { id: 5, name: 'Junction 5' },
  { id: 6, name: 'Exit 🏁' }
];

export default function Play() {
  const [step, setStep] = useState(0);
  const [question, setQuestion] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(true);
  const [detail, setDetail] = useState('');
  const [score, setScore] = useState(0);

  // pick random question
  useEffect(() => {
    if (step < steps.length - 1) {
      const q = questions[Math.floor(Math.random() * questions.length)];
      setQuestion(q);
      setShowResult(false);
    }
  }, [step]);

  const handleAnswer = (userAns) => {
    const isRight = userAns === question.ans;
    setCorrect(isRight);
    setDetail(question.detail);
    setShowResult(true);
    if (isRight) setScore((s) => s + 10);
  };

  const nextStep = () => {
    if (!correct) {
      // dead-end → restart
      setStep(0);
      setScore(0);
      return;
    }
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  if (step === steps.length - 1) {
    // VICTORY
    return (
      <div className="play-wrapper">
        <div className="victory">
          <h1>🎉 You Escaped!</h1>
          <p>Final Score: {score}</p>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="play-wrapper">
      <header className="play-header">
        <h2>CodeRunner Maze</h2>
        <div className="score">Score: {score}</div>
      </header>

      <main className="play-main">
        {/* Maze Path Visual */}
        <div className="maze">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`node ${i === step ? 'active' : i < step ? 'done' : ''}`}
            >
              {s.name}
            </div>
          ))}
        </div>

        {/* Question Gate */}
        <div className="gate">
          <h3>Junction {step + 1}</h3>
          {question && !showResult && (
            <>
              <p className="question">{question.q}</p>
              <div className="choices">
                <button className="choice" onClick={() => handleAnswer(true)}>
                  Yes
                </button>
                <button className="choice" onClick={() => handleAnswer(false)}>
                  No
                </button>
              </div>
            </>
          )}

          {showResult && (
            <div className={`result ${correct ? 'right' : 'wrong'}`}>
              <p>{correct ? '✅ Correct!' : '❌ Wrong!'}</p>
              <p>{detail}</p>
              <button className="btn" onClick={nextStep}>
                {correct ? 'Continue' : 'Restart'}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="play-footer">
        <Link to="/" className="btn">Exit Game</Link>
      </footer>
    </div>
  );
}