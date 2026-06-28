import express from 'express';

const router = express.Router();
let productsCollection;

export function setProductsCollection(collection) {
  productsCollection = collection;
}

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await productsCollection.find({}).toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productsCollection.findOne({ id });
    
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
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
    
    const result = await productsCollection.insertOne(newProduct);
    res.json({ message: 'Produk berhasil ditambahkan', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
