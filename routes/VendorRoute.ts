import express, { Request, Response } from 'express';
import { GetVendorProfile, UpdateVendorProfile, UpdateVendorService, VendorLogin } from '../controller';

const router = express.Router();

router.post('/login', VendorLogin);

router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.get('/', (req: Request, res: Response) => {
    res.json('GET request to the Vendor');
});


export { router as VendorRoute };