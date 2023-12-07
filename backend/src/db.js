import { connect } from 'mongoose'
import { DB_URI } from './config.js';

export const connectDB = async () => {
    try {
        await connect(DB_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
    }
}