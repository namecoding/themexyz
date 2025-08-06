// lib/dbConnect.js
import mongoose from 'mongoose';

const THEMEXYZ_DATABASE = process.env.THEMEXYZ_DATABASE;

if (!THEMEXYZ_DATABASE) {
    throw new Error('Please define the THEMEXYZ DATABASE environment variable');
}

let cached = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(THEMEXYZ_DATABASE, {
            bufferCommands: false,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
