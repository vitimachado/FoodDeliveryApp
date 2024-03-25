import { Application } from 'express';
import { AdminROuter, CustomerRoute, ShoppingRoute, RestaurantRoute } from '../routes';
import bodyParser from 'body-parser';

export default async (app: Application) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use('/admin', AdminROuter);
    app.use('/restaurant', RestaurantRoute);
    app.use('/shop', ShoppingRoute);
    app.use('/customer', CustomerRoute);

    return app;
};
