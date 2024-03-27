import express from 'express';
import { Authenticate } from '../middlewares/CommonAuth';
import { CreateOrder, GetOrders, GetOrderById, GetOrderByOrderId } from '../controller/OrderController';

const router = express.Router();

// Authentication
router.use(Authenticate);

/** -------------------------- Order --------------------------- **/
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/orderById/:id', GetOrderById);
router.get('/orderByOrderId/:orderId', GetOrderByOrderId);

export { router as OrderRoute };
