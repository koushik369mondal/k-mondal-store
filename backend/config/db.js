import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log(`✅ MongoDB Connected Successfully`);
            return;
        } catch (error) {
            console.error(`❌ MongoDB Connection Failed (Attempt ${attempt}/${retries}): ${error.message}`);
            if (attempt < retries) {
                console.log(`🔄 Retrying in ${delay / 1000}s...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('💀 All retry attempts exhausted. Exiting.');
                process.exit(1);
            }
        }
    }
};

export default connectDB;
