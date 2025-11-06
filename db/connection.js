require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

        const conn = await mongoose.connect(connectionString);

        console.log(`✅ MongoDB Connected Successfully`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🎯 Host: ${conn.connection.host}`);
        
        return conn;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;