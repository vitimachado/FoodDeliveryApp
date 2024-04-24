import express, { Application } from 'express';
import { AdminROuter, CustomerRoute, ShoppingRoute, RestaurantRoute, OrderRoute } from '../routes';
import cors from 'cors';

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    
    app.use('/admin', AdminROuter);
    app.use('/restaurant', RestaurantRoute);
    app.use('/shop', ShoppingRoute);
    app.use('/customer', CustomerRoute);
    app.use('/order', OrderRoute);

    return app;
};
