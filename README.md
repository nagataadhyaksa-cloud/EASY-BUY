# EASY BUY

Website e-commerce untuk SMA Citra Nusa dengan fitur belanja online yang sempurna.

## 🎯 Fitur Utama

- ✅ Browsing Produk
- ✅ Keranjang Belanja
- ✅ Authentication (Register/Login)
- ✅ Order Management
- ✅ Backend API dengan MongoDB
- ✅ Responsive Design

## 🚀 Quick Start

### Requirement
- Node.js v14+
- MongoDB (local atau Atlas)
- Modern Browser

### Setup

1. **Clone Repository**
```bash
git clone https://github.com/nagataadhyaksa-cloud/EASY-BUY.git
cd EASY-BUY
```

2. **Setup Backend**
```bash
cd beckend
npm install
cp .env.example .env
# Edit .env dengan config MongoDB Anda
npm run dev
```

3. **Setup Frontend**
Buka file `frontend/index.html` dengan Live Server atau:
```bash
cd frontend
python -m http.server 3000
```

### Testing
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000 atau http://localhost:5500

## 📚 Documentation

Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap.

## 📁 Struktur

```
.
├── beckend/          # Backend API (Node.js + Express)
├── frontend/         # Frontend Web
├── SETUP.md          # Setup guide
└── README.md         # Ini
```

## 🔗 Links

- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: mongodb://localhost:27017/easybuy

## 📝 License

Private Project - SMA Citra Nusa
