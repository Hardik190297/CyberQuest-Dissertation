import { Routes, Route, Link } from 'react-router-dom';   // ← remove BrowserRouter
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import CyberQuestGame from './CyberQuestGame.jsx';


function App() {
  return (
    <>
      <nav className="bg-gray-800 p-4 text-white flex justify-center space-x-4">
        <Link to="/">Home</Link>
        <Link to="/play">Play Cyber Quest</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/play" element={<CyberQuestGame />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<h1>404 – Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;