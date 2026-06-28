import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

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
    const productsCollection = db.collection('products');

    if (req.method === 'GET') {
      const products = await productsCollection.find({}).toArray();
      return res.status(200).json(products);
    }

    if (req.method === 'POST') {
      const { name, description, price, image, stock } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: 'Name dan price wajib diisi' });
      }

      const newProduct = {
        id: Date.now().toString(),
        name,
        description,
        price,
        image,
        stock: stock || 0,
        createdAt: new Date()
      };

      await productsCollection.insertOne(newProduct);
      return res.status(201).json({ 
        message: 'Produk berhasil ditambahkan', 
        product: newProduct 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
