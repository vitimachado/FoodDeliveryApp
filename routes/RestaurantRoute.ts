import express, { Request, Response } from 'express';
import { AddFood, GetFoods, GetRestaurantProfile, UpdateRestaurantProfile, UpdateRestaurantService, RestaurantLogin } from '../controller';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

router.post('/login', RestaurantLogin);

router.use(Authenticate);

router.get('/profile', GetRestaurantProfile);
router.patch('/profile', UpdateRestaurantProfile);
router.patch('/service', UpdateRestaurantService);

router.post('/food', AddFood);
router.get('/foods', GetFoods);

router.get('/', (req: Request, res: Response) => {
    res.json('GET request to the Restaurant');
});


export { router as RestaurantRoute };