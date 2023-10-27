import { mongoose } from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

// Connection options
const dbOptions = {
  useNewUrlParser: true,
  dbName: process.env.DB_NAME,// Your MongoDB database name
};

// Database URI
const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`;

// Connect to MongoDB
export async function mongoConnect(){
    try {
        await mongoose.connect(dbURI, dbOptions);
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export async function mongoDisconnect(){
    try {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
      } catch (error) {
        console.error('Error closing the database connection:', error);
    }
}

export async function mongooseQuery(callback){
    let res = null;
    try{
        res = await callback();
    }catch(err){
        console.log('mongooseQuery error:', err);
    }
    finally{
        return res;
    }
}