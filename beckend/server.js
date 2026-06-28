import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import { setUsersCollection } from './routes/auth.js';
import { setProductsCollection } from './routes/products.js';
import { setOrdersCollection } from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/easybuy');

async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db('easybuy');
    console.log('✅ MongoDB Connected');
    
    // Set collections untuk routes
    setUsersCollection(db.collection('users'));
    setProductsCollection(db.collection('products'));
    setOrdersCollection(db.collection('orders'));
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running ✅', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 API Health Check: http://localhost:${PORT}/api/health`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
