import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import keepAliveJob from './config/cron.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS configuration to allow frontend domain
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'https://k-mondal-store-frontend.onrender.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'K Mondal Store API is running' });
});

// Health check endpoint for Docker and monitoring
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "FinTrack API is healthy" });
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start the cron job to keep the server awake
    keepAliveJob.start();
    console.log('[Cron] Keep-alive job started - running every 14 minutes');
});

export default app;
