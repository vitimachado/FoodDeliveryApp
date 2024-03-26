
import dotenv from 'dotenv';
dotenv.config();

const APP_SECRET_JWT = process.env.APP_SECRET_JWT as string;
const MONGO_URI = process.env.MONGO_URI as string;
const PORT = process.env.PORT as string;

export {
    APP_SECRET_JWT,
    MONGO_URI,
    PORT
};