import express, { Request, Response } from 'express';
import { CreateVendor, GetVendorById, GetVendors } from '../controller';

const router = express.Router();

router.post('/vendor', CreateVendor);

router.get('/vendors', GetVendors);

router.get('/vendor/:id', GetVendorById);

router.get('/', (req: Request, res: Response) => {
    res.json('GET request to the Admin');
});

export { router as AdminROuter };