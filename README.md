# K Mondal Store - E-commerce Platform

A full-stack MERN e-commerce application with premium UI design, comprehensive order management, and automated CI/CD pipeline.

[![CI Pipeline](https://github.com/koushik369mondal/k-mondal-store/actions/workflows/ci.yml/badge.svg)](https://github.com/koushik369mondal/k-mondal-store/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/koushik369mondal/k-mondal-store/actions/workflows/cd.yml/badge.svg)](https://github.com/koushik369mondal/k-mondal-store/actions/workflows/cd.yml)

## 🌐 Live Demo

- **Frontend**: [https://k-mondal-store-frontend.onrender.com](https://k-mondal-store-frontend.onrender.com)
- **Backend API**: [https://k-mondal-store-backend.onrender.com](https://k-mondal-store-backend.onrender.com)

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/koushik369mondal/k-mondal-store.git
   cd k-mondal-store
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## ✨ Features

### User Features

- 🛍️ Browse products with beautiful card designs
- 🛒 Shopping cart functionality
- 📦 Place orders (with or without login)
- 👤 User account management
- 📋 "My Orders" page to track orders
- 🔐 Secure authentication with JWT

### Admin Features

- 📊 Admin dashboard
- ➕ Add/Edit/Delete products with category dropdown
- 📦 Order management system
- 🔄 Update order status
- 👥 View all orders (including guest orders)

### Design Features

- 🎨 Premium color palette (Deep Green, Gold, Cream, Charcoal)
- 💎 Luxury UI with shadows and rounded corners
- 📱 Fully responsive design
- ⚡ Modern Tailwind CSS styling

### DevOps Features

- 🔄 Automated CI/CD pipeline with GitHub Actions
- 🔒 Security audits on every push
- 📦 Automated dependency updates
- 🏥 Health check endpoints
- 📊 Build artifacts and caching

## 📁 Project Structure

```
k-mondal-store/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── cd.yml              # Continuous Deployment
│   │   └── dependency-update.yml
│   └── DEPLOYMENT.md           # Deployment guide
├── backend/
│   ├── config/                 # Database & Cloudinary config
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth & upload middleware
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   └── server.js               # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # State management
│   │   ├── pages/              # Page components
│   │   └── utils/              # API & utilities
│   └── vite.config.js
└── README.md
```

## 📚 API Endpoints

### Authentication

- POST `/api/auth/register` - Create new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Products

- GET `/api/products` - Get all products
- POST `/api/products` - Create product (admin)
- PUT `/api/products/:id` - Update product (admin)
- DELETE `/api/products/:id` - Delete product (admin)

### Orders

- POST `/api/orders` - Create order (optional auth)
- GET `/api/orders/me` - Get user's orders (auth required)
- GET `/api/orders` - Get all orders (admin only)
- GET `/api/orders/:id` - Get order by ID (auth required)
- PUT `/api/orders/:id` - Update order status (admin)
- DELETE `/api/orders/:id` - Delete order (admin)

### Health Check

- GET `/health` - Health status endpoint

## 🎨 Product Categories

- Groceries
- Soft Drink
- Cake
- Rice
- Dal
- Oil & Ghee
- Masala & Spices
- Snacks
- Personal Care
- Home Care
- Baby Care
- Pet Care
- Others

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
```

## 🚀 CI/CD Pipeline

This project uses GitHub Actions for automated testing and deployment:

### Continuous Integration

- Runs on every push and pull request
- Tests on Node.js 18.x and 20.x
- Security vulnerability scanning
- Build verification
- Artifact generation

### Continuous Deployment

- Automatic deployment on push to main
- Build optimization
- Docker image creation
- Multiple deployment options (Vercel, Netlify, AWS, etc.)

### Setup Instructions

See [DEPLOYMENT.md](.github/DEPLOYMENT.md) for detailed setup instructions.

## 🏪 Store Information

**K Mondal Store**

- Location: Santimore, Kalabari Road, Banarhat, Jalpaiguri, West Bengal - 735202
- Phone: +91 9733257431, +91 9593295965
- Email: kmondalstore@gmail.com

**Business Hours:**

- Mon - Sat: 6:00 AM - 11:45 AM & 3:00 PM - 9:00 PM
- Sunday: 6:00 AM - 9:00 AM & 3:00 PM - 9:00 PM

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow

- All pull requests must pass CI checks
- Code must build successfully
- Security audits must pass
- Follow existing code style

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Koushik Mondal**

- GitHub: [@koushik369mondal](https://github.com/koushik369mondal)
- Email: kmondalstore@gmail.com

## 🙏 Acknowledgments

- MongoDB for database
- Cloudinary for image storage
- Tailwind CSS for styling
- GitHub Actions for CI/CD

---

⭐ Star this repo if you find it helpful!

For deployment and production setup, see [DEPLOYMENT.md](.github/DEPLOYMENT.md)
