import mongoose, { ConnectOptions } from 'mongoose';

// Load environment variables
const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env');
}

// Database Connection Function
const connectDB = async (): Promise<void> => {
    try {
        mongoose.set('strictQuery', false);

        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);

        console.log(`|---: MongoDB connected successfully :---|`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;
