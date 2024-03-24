import express from 'express';
import { GetFoodAvailability, GetTopRestaturants, GetFoodAvaiable30Min, GetSearchFood, FindRestaurantById } from '../controller';

const router = express.Router();

/** -------------------- Food Availability --------------------- **/
router.get('/:pinCode', GetFoodAvailability);

/** -------------------- Top Restaturants ---------------------- **/
router.get('/:top-restaurants/:pinCode', GetTopRestaturants);

/** ------------------- Food Avaiable on 30min ----------------- **/
router.get('/foods-in-30-min/:pinCode', GetFoodAvaiable30Min);

/** ----------------------- Search Food ------------------------ **/
router.get('/search//:pinCode', GetSearchFood);

/** ------------------ Find Restaurant By ID ------------------- **/
router.get('/restaurant/:id', FindRestaurantById);

export { router as ShoppingRoute };
