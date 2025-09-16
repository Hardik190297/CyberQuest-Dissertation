// server.js - CodeRunner Cyber Quest Backend
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection using Mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coderunner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully to coderunner database');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  gameProgress: {
    level: { type: Number, default: 1 },
    score: { type: Number, default: 0 },
    achievements: [{ type: String }],
    completedLevels: [{ type: Number }]
  },
  tutorialProgress: {
    type: Map,
    of: Boolean,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CodeRunner Cyber Quest API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API Health Check Passed',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// User Registration (Signup)
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Signup attempt:', { username, email });

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    console.log('User created successfully:', user.username);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      username: user.username,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gameProgress: user.gameProgress,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    console.log('Login successful:', user.username);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      username: user.username,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gameProgress: user.gameProgress,
        tutorialProgress: user.tutorialProgress,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Get User Profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update Tutorial Progress
app.post('/api/tutorial-progress', authenticateToken, async (req, res) => {
  try {
    const { sectionId, tutorialId, completed } = req.body;
    
    if (!sectionId || !tutorialId || typeof completed !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Section ID, tutorial ID, and completion status are required'
      });
    }

    const progressKey = `${sectionId}_${tutorialId}`;
    
    const user = await User.findById(req.user._id);
    if (!user.tutorialProgress) {
      user.tutorialProgress = new Map();
    }
    
    user.tutorialProgress.set(progressKey, completed);
    user.markModified('tutorialProgress');
    await user.save();

    res.json({
      success: true,
      message: 'Tutorial progress updated',
      tutorialProgress: user.tutorialProgress
    });

  } catch (error) {
    console.error('Tutorial progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tutorial progress'
    });
  }
});

// Legacy saveScore endpoint (for compatibility with your existing code)
app.post('/api/saveScore', authenticateToken, async (req, res) => {
  try {
    const { score } = req.body;
    
    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Score is required'
      });
    }

    const user = await User.findById(req.user._id);
    user.gameProgress.score = Math.max(user.gameProgress.score, score);
    await user.save();

    res.json({
      success: true,
      message: 'Score saved successfully',
      score: user.gameProgress.score
    });

  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving score'
    });
  }
});

// Legacy getScore endpoint (for compatibility)
app.get('/api/getScore/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.json({ username, score: 0 });
    }

    res.json({ 
      username: user.username, 
      score: user.gameProgress.score,
      level: user.gameProgress.level
    });

  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching score'
    });
  }
});

// Update Game Progress
app.post('/api/game-progress', authenticateToken, async (req, res) => {
  try {
    const { level, score, achievements, completedLevels } = req.body;

    const user = await User.findById(req.user._id);
    
    if (level !== undefined) user.gameProgress.level = Math.max(user.gameProgress.level, level);
    if (score !== undefined) user.gameProgress.score = Math.max(user.gameProgress.score, score);
    if (achievements && Array.isArray(achievements)) {
      user.gameProgress.achievements = [...new Set([...user.gameProgress.achievements, ...achievements])];
    }
    if (completedLevels && Array.isArray(completedLevels)) {
      user.gameProgress.completedLevels = [...new Set([...user.gameProgress.completedLevels, ...completedLevels])];
    }

    await user.save();

    res.json({
      success: true,
      message: 'Game progress updated',
      gameProgress: user.gameProgress
    });

  } catch (error) {
    console.error('Game progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating game progress'
    });
  }
});

// Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ 'gameProgress.score': -1, 'gameProgress.level': -1 })
      .limit(10)
      .select('username gameProgress.score gameProgress.level createdAt');

    res.json({
      success: true,
      leaderboard: topUsers.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        score: user.gameProgress.score,
        level: user.gameProgress.level,
        joinDate: user.createdAt
      }))
    });

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📄 Database connection closed');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CodeRunner Cyber Quest API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/coderunner'}`);
});