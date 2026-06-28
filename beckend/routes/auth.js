import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
let usersCollection;

export function setUsersCollection(collection) {
  usersCollection = collection;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
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
    
    res.json({ 
      message: 'Registrasi berhasil', 
      userId: result.insertedId,
      user: { id: result.insertedId, email, name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
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
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key', {
      expiresIn: '7d'
    });
    
    res.json({ 
      token, 
      user: { id: user._id, email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
