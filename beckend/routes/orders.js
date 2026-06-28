import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
let ordersCollection;

export function setOrdersCollection(collection) {
  ordersCollection = collection;
}

// Middleware untuk verifikasi token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token diperlukan' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token tidak valid' });
  }
}

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items tidak boleh kosong' });
    }
    
    const newOrder = {
      userId: req.userId,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await ordersCollection.insertOne(newOrder);
    
    res.json({ 
      message: 'Order berhasil dibuat', 
      orderId: result.insertedId,
      order: newOrder 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await ordersCollection.find({ userId: req.userId }).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await ordersCollection.findOne({ _id: orderId, userId: req.userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
