import mongoose from 'mongoose';
import { MONGO_URI } from '../config';

export default async () => {
    try {
        mongoose.connect(MONGO_URI)
        .then(res => {
            console.log('mongoose connected')
        })
        .catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }
}
