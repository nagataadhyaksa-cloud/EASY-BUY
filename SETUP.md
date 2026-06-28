# EASY BUY - Panduan Setup Lengkap

## 📋 Status Proyek

✅ **Frontend**: Siap dengan UI dan koneksi ke Backend
✅ **Backend**: API endpoints sudah disiapkan
⏳ **Database**: Perlu setup
⏳ **Deployment**: Belum

---

## 🔧 Setup Lokal (Development)

### Prasyarat
Instal aplikasi ini terlebih dahulu:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB Community](https://www.mongodb.com/try/download/community) ATAU [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud)
- [Git](https://git-scm.com/)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/nagataadhyaksa-cloud/EASY-BUY.git
cd EASY-BUY
```

### 2️⃣ Setup Backend

```bash
cd beckend

# Install dependencies
npm install

# Buat file .env dari .env.example
cp .env.example .env
```

**Edit `.env` dengan konfigurasi Anda:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/easybuy
JWT_SECRET=your_super_secret_key_change_this_123456
NODE_ENV=development
```

**Jika menggunakan MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easybuy?retryWrites=true&w=majority
```

**Jalankan Backend:**
```bash
npm run dev
```

Anda seharusnya melihat:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
📋 API Health Check: http://localhost:5000/api/health
```

### 3️⃣ Setup Frontend

Buka terminal baru (jangan tutup backend):

```bash
cd frontend
```

**Jalankan dengan Live Server (VSCode):**
- Install extension "Live Server" di VSCode
- Right-click pada `index.html` → "Open with Live Server"
- Akan otomatis terbuka di `http://localhost:5500`

**ATAU gunakan Python:**
```bash
python -m http.server 3000
```
Akses di: `http://localhost:3000`

---

## 🧪 Testing API

### Menggunakan Postman atau cURL

**1. Health Check**
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "message": "Backend is running ✅",
  "timestamp": "2026-06-28T..."
}
```

**2. Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**3. Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response (simpan TOKEN ini):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**4. Get Products**
```bash
curl http://localhost:5000/api/products
```

**5. Create Order (menggunakan TOKEN dari login)**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "id": "1",
        "name": "Sepatu Sneakers",
        "price": 900000,
        "quantity": 2
      }
    ],
    "total": 1800000
  }'
```

---

## 🎯 Workflow Testing di Browser

### Setup Database (MongoDB)

**Jika pakai lokal:**
1. Download & install [MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
2. Jalankan MongoDB:
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   brew services start mongodb-community
   ```

**Jika pakai MongoDB Atlas (Cloud - Recommended):**
1. Buat akun di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Buat cluster baru
3. Ambil connection string
4. Update di `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easybuy
   ```

### Testing di Frontend

1. **Buka** `http://localhost:5500` (atau port Anda)
2. **Test fitur:**
   - ✅ Produk dimuat dari backend
   - ✅ Click produk → Modal terbuka
   - ✅ Tambah ke keranjang
   - ✅ Lihat keranjang
   - ✅ Klik Checkout → Redirect ke login
3. **Register akun baru** di `/register.html`
4. **Login** di `/login.html`
5. **Keranjang seharusnya bisa checkout sekarang** ✅

---

## 📁 Struktur Folder

```
EASY-BUY/
├── beckend/                 # Backend API
│   ├── .env                 # Environment variables (jangan push!)
│   ├── .env.example         # Template .env
│   ├── package.json
│   ├── server.js            # Main server
│   ├── routes/
│   │   ├── auth.js          # Login/Register
│   │   ├── products.js      # Produk endpoints
│   │   └── orders.js        # Order endpoints
│   └── README.md
│
├── frontend/                # Frontend Web
│   ├── index.html           # Homepage
│   ├── login.html           # Login page
│   ├── register.html        # Register page
│   ├── app.js               # Main JavaScript
│   ├── styles.css           # Styling
│   └── checkout.jsx         # (Belum digunakan)
│
└── README.md
```

---

## 🚀 Deploy ke Production

### Frontend (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
- Connect repository ke Netlify
- Build command: (tidak ada)
- Publish directory: `frontend`

### Backend (Heroku/Railway)

**Railway:**
1. Push ke GitHub
2. Connect di [railway.app](https://railway.app)
3. Pastikan `MONGODB_URI` di environment variables
4. Deploy otomatis

**Heroku:**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## ⚠️ Troubleshooting

### Error: "Cannot POST /api/auth/login"
- ✅ Pastikan backend sedang running (`npm run dev`)
- ✅ Cek URL di `app.js` → `BACKEND_URL`

### Error: "CORS Policy"
- ✅ Backend sudah configure CORS untuk `localhost:3000` dan `localhost:5500`
- ✅ Jika pakai port lain, update di `server.js`:
  ```javascript
  app.use(cors({
    origin: ['http://localhost:YOUR_PORT'],
    credentials: true
  }));
  ```

### Error: "MongoDB Connection Error"
- ✅ Pastikan MongoDB running
- ✅ Cek `MONGODB_URI` di `.env`
- ✅ Jika pakai Atlas, cek IP whitelist

### Produk tidak muncul
- ✅ Backend belum ada data produk
- ✅ Frontend fallback ke static products
- ✅ Untuk tambah produk:
  ```bash
  curl -X POST http://localhost:5000/api/products \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Produk Baru",
      "description": "Deskripsi",
      "price": 500000,
      "image": "https://..."
    }'
  ```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)

#### Orders
- `POST /orders` - Create order (login required)
- `GET /orders` - Get user orders (login required)
- `GET /orders/:orderId` - Get order details (login required)

---

## ✅ Checklist untuk Production

- [ ] Backend deployed (Heroku/Railway)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Update `BACKEND_URL` di `app.js`
- [ ] Setup MongoDB Atlas
- [ ] Change `JWT_SECRET` ke random string panjang
- [ ] Test semua fitur di production
- [ ] Setup SSL certificate
- [ ] Monitor error logging
- [ ] Database backup strategy
- [ ] CI/CD pipeline

---

## 💡 Next Steps

1. **Payment Gateway** (Midtrans, Stripe)
2. **Email Notifications** (sendgrid)
3. **Admin Panel** untuk manage produk
4. **Search & Filter** produk
5. **Review & Rating** produk
6. **Order Tracking**
7. **Image Upload** ke cloud storage
8. **Wishlist** feature

---

**Hubungi jika ada pertanyaan!** 🚀
