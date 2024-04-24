import express, { Request, Response } from 'express';
import { CreateRestaurant, GetRestaurantById, GetRestaurants } from '../controller';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

// Authentication
router.use(Authenticate);

router.post('/restaurant', CreateRestaurant);

router.get('/restaurants', GetRestaurants);

router.get('/restaurant/:id', GetRestaurantById);

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: '200', message: 'OK' });
});

export { router as AdminROuter };