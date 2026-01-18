import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import keepAliveJob from './config/cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://k-mondal-store-frontend.onrender.com',
        'https://k-mondal-store.onrender.com'  // If serving frontend from same domain
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API ROUTES - MUST COME BEFORE STATIC FILES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "K Mondal Store API is healthy",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// SERVE FRONTEND (PRODUCTION ONLY)
// ==========================================
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');

    // Serve static files (JS, CSS, images, etc.)
    app.use(express.static(frontendPath, {
        maxAge: '1y',  // Cache static assets for 1 year
        etag: true
    }));

    // SPA FALLBACK - serve index.html for all non-API routes
    // This is the critical part that fixes the refresh issue!
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'), {
            headers: {
                'Cache-Control': 'no-cache'  // Don't cache index.html
            }
        });
    });
} else {
    // Development mode - just serve API
    app.get('/', (req, res) => {
        res.json({
            message: 'K Mondal Store API is running in development mode',
            apiEndpoints: [
                'POST /api/auth/login',
                'POST /api/auth/register',
                'GET /api/products',
                'GET /api/orders',
                'GET /api/cart'
            ]
        });
    });
}

// ==========================================
// ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    if (process.env.NODE_ENV === 'production') {
        console.log('✅ Serving frontend from backend (SPA mode enabled)');
    }

    // Start the cron job to keep the server awake
    keepAliveJob.start();
    console.log('[Cron] Keep-alive job started - running every 14 minutes');
});

export default app;
