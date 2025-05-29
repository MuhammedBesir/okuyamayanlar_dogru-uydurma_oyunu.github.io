const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB connection string in environment variables later
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp_bot_db';
let db;

async function connectDB() {
    if (db) return db;
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(); // You can specify DB name here if not in URI: client.db('whatsapp_bot_db')
        console.log("Successfully connected to MongoDB.");
        return db;
    } catch (err) {
        console.error("Could not connect to MongoDB.", err);
        throw err;
    }
}

function getDB() {
    if (!db) {
        throw new Error("DB not initialized. Call connectDB first.");
    }
    return db;
}

module.exports = { connectDB, getDB };
