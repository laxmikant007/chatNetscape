import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to : ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;