import express, { Request, Response } from 'express';
import { AddFood, GetFoods, GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

router.post('/login', VendorLogin);

router.use(Authenticate);

router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.post('/food', AddFood);
router.get('/foods', GetFoods);

router.get('/', (req: Request, res: Response) => {
    res.json('GET request to the Vendor');
});


export { router as VendorRoute };