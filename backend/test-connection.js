// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI || 'mongodb://localhost:27017/coderunner');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coderunner', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.length > 0 ? collections.map(c => c.name) : 'No collections yet');
    
    // Test creating a simple document
    const testCollection = mongoose.connection.db.collection('connectionTest');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    console.log('💾 Test document created successfully');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    console.log('🎉 All tests passed! Your MongoDB setup is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running: brew services start mongodb-community');
    console.log('2. Check if port 27017 is free: lsof -i :27017');
    console.log('3. Verify your .env file has the correct MONGODB_URI');
    console.log('4. Try connecting with: mongosh mongodb://localhost:27017/coderunner');
    process.exit(1);
  }
};

testConnection();