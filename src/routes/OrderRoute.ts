import express from 'express';
import { CreateOrder, GetOrderById, GetOrderByOrderId, GetOrders } from '../controller';
import { Authenticate } from '../middlewares/CommonAuth';

const router = express.Router();

// Authentication
router.use(Authenticate);

/** -------------------------- Order --------------------------- **/
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/orderById/:id', GetOrderById);
router.get('/orderByOrderId/:orderId', GetOrderByOrderId);

export { router as OrderRoute };
