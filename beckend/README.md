# EASY BUY Backend API

Backend API untuk aplikasi e-commerce EASY BUY.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.example` ke `.env` dan isi dengan konfigurasi Anda:
```bash
cp .env.example .env
```

### 3. Setup MongoDB
- Install MongoDB lokal atau gunakan MongoDB Atlas
- Update `MONGODB_URI` di `.env`

### 4. Run Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Cek status server

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get semua produk
- `GET /api/products/:id` - Get produk spesifik
- `POST /api/products` - Create produk baru (admin only)

### Orders
- `POST /api/orders` - Create order (memerlukan token)
- `GET /api/orders` - Get order user (memerlukan token)
- `GET /api/orders/:orderId` - Get order spesifik (memerlukan token)

## Testing API

Gunakan Postman atau curl untuk testing:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
