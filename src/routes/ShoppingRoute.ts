import express from 'express';
import { GetRestaurantFoodsAvailability, GetTopRestaturants, GetSearchFood, GetFoodsAvaiableByReadyTime, GetRestaurantById } from '../controller';

const router = express.Router();

/** -------------------- Food Availability --------------------- **/
router.get('/:id', GetRestaurantFoodsAvailability);

/** -------------------- Top Restaturants ---------------------- **/
router.get('/top-restaurants/:limit/:id?', GetTopRestaturants);

/** ------------------- Food Avaiable on 30min ----------------- **/
router.get('/foods-ready-time-less-than/:lessThan/:id', GetFoodsAvaiableByReadyTime);

/** ----------------------- Search Food ------------------------ **/
router.post('/search/:id', GetSearchFood);

/** ------------------ Find Restaurant By ID ------------------- **/
router.get('/restaurant/:id', GetRestaurantById);

export { router as ShoppingRoute };
