import mongoose from 'mongoose';
import { DB_NAME } from '../constants/db.constant';

const connectDB = async () => {
    try{
        const connectionMetaData = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log('DB connected: ', connectionMetaData.connection.host, connectionMetaData.connection.name);
    }catch(error){
        console.log('DB connection error: ', error);
        process.exit(1);
    }
}

export default connectDB