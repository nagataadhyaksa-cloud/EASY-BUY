import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

let cachedClient = null;

async function connectDB() {
  if (cachedClient) return cachedClient;
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

function verifyToken(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ error: 'Token diperlukan' });
  }

  try {
    const client = await connectDB();
    const db = client.db('easybuy');
    const ordersCollection = db.collection('orders');

    if (req.method === 'GET') {
      const orders = await ordersCollection.find({ userId: decoded.userId }).toArray();
      return res.status(200).json(orders);
    }

    if (req.method === 'POST') {
      const { items, total } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Items tidak boleh kosong' });
      }

      const newOrder = {
        userId: decoded.userId,
        items,
        total,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await ordersCollection.insertOne(newOrder);
      return res.status(201).json({
        message: 'Order berhasil dibuat',
        orderId: result.insertedId,
        order: newOrder
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
