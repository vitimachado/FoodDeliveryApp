import express from 'express';
import { CustomerSignup, CustomerLogin, CustomerVerify, GetCustomerProfile, EditCustomerProfile, AddCart, DeleteCart, GetCart } from '../controller';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

/** ---------------- Signup / Create Customer ------------------ **/
router.post('/signup', CustomerSignup);

/** -------------------------- Login --------------------------- **/
router.post('/login', CustomerLogin);

// Authentication
router.use(Authenticate);

/** ------------------- Verify Customer Acount ----------------- **/
router.get('/verify', CustomerVerify);

/** ------------------------- Profile -------------------------- **/
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

/** --------------------------- Cart ---------------------------- **/
router.post('/cart', AddCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);

export { router as CustomerRoute };
