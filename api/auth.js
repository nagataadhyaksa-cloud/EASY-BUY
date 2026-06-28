import { MongoClient } from 'mongodb';
import bcryptjs from 'bcryptjs';
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

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await connectDB();
    const db = client.db('easybuy');
    const usersCollection = db.collection('users');

    if (req.method === 'POST') {
      const { action, email, password, name } = req.body;

      if (action === 'register') {
        // REGISTER
        if (!email || !password || !name) {
          return res.status(400).json({ error: 'Email, password, dan name wajib diisi' });
        }

        const existing = await usersCollection.findOne({ email });
        if (existing) {
          return res.status(400).json({ error: 'Email sudah terdaftar' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const result = await usersCollection.insertOne({
          email,
          password: hashedPassword,
          name,
          createdAt: new Date()
        });

        return res.status(201).json({
          message: 'Registrasi berhasil',
          userId: result.insertedId,
          user: { id: result.insertedId, email, name }
        });
      }

      if (action === 'login') {
        // LOGIN
        if (!email || !password) {
          return res.status(400).json({ error: 'Email dan password wajib diisi' });
        }

        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: 'Email tidak ditemukan' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Password salah' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
          token,
          user: { id: user._id, email, name: user.name }
        });
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
