import { Application } from 'express';
import { AdminROuter, CustomerRoute, ShoppingRoute, VendorRoute } from '../routes';
import bodyParser from 'body-parser';

export default async (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use('/admin', AdminROuter);
    app.use('/vendor', VendorRoute);
    app.use('/shop', ShoppingRoute);
    app.use('/customer', CustomerRoute);

    return app;
};
