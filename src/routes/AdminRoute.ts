import express, { Request, Response } from 'express';
import { CreateRestaurant, GetRestaurantById, GetRestaurants } from '../controller';

const router = express.Router();

router.post('/restaurant', CreateRestaurant);

router.get('/restaurants', GetRestaurants);

router.get('/restaurant/:id', GetRestaurantById);

router.get('/', (req: Request, res: Response) => {
    res.json('GET request to the Admin');
});

export { router as AdminROuter };