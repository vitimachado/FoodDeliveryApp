import express from 'express';
import { GetFoodAvailability, GetTopRestaturants, GetSearchFood, FindRestaurantById, GetFoodsAvaiableByReadyTime } from '../controller';

const router = express.Router();

/** -------------------- Food Availability --------------------- **/
router.get('/:pinCode', GetFoodAvailability);

/** -------------------- Top Restaturants ---------------------- **/
router.get('/top-restaurants/:limit/:pinCode', GetTopRestaturants);

/** ------------------- Food Avaiable on 30min ----------------- **/
router.get('/foods-ready-time-less-than/:lessThan/:pinCode', GetFoodsAvaiableByReadyTime);

/** ----------------------- Search Food ------------------------ **/
router.get('/search//:pinCode', GetSearchFood);

/** ------------------ Find Restaurant By ID ------------------- **/
router.get('/restaurant/:id', FindRestaurantById);

export { router as ShoppingRoute };
