import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import CoreConceptsGame from './CoreConceptsGames.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CoreConceptsGame />
  </StrictMode>,
);