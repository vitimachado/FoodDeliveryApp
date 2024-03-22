import express from 'express';
import { AdminROuter, VendorRoute } from './routes';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { MONGO_URI } from './config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', AdminROuter);
app.use('/vendor', VendorRoute);

mongoose.connect(MONGO_URI)
.then(res => {
    console.log('mongoose connected')
})
.catch(err => console.log(err));

app.listen(8000, () => {
    console.log('listening');
});