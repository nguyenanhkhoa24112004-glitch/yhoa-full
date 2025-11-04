import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Vui lòng định nghĩa biến môi trường MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Trong môi trường development, sử dụng biến global để duy trì kết nối
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Trong môi trường production, tạo kết nối mới
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;