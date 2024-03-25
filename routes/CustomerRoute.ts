import express from 'express';
import { CustomerSignup, CustomerLogin, CustomerVerify, RequestOtp, GetCustomerProfile, EditCustomerProfile } from '../controller';

const router = express.Router();

/** ---------------- Signup / Create Customer ------------------ **/
router.post('/signup', CustomerSignup);

/** -------------------------- Login --------------------------- **/
router.post('/login', CustomerLogin);

/** ------------------- Verify Customer Acount ----------------- **/
router.patch('/verify', CustomerVerify);

/** ------------------ OTP / Requesting OTP -------------------- **/
router.get('/otp', RequestOtp);

/** ------------------------- Profile -------------------------- **/
router.get('/profile', GetCustomerProfile);
router.patch('/profile', EditCustomerProfile);

export { router as CustomerRoute };
