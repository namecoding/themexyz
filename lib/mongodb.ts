// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.THEMEXYZ_DATABASE!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.THEMEXYZ_DATABASE) {
    throw new Error("Please add your THEMEXYZ DATABASE to .env");
}

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
