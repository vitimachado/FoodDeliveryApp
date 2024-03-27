import express from 'express';
import { Authenticate } from '../middlewares/CommonAuth';
import { CreateOrder, GetOrders, GetOrderById, GetOrderByOrderId, AddCart, DeleteCart, GetCart } from '../controller/OrderController';

const router = express.Router();

// Authentication
router.use(Authenticate);

/** -------------------------- Order --------------------------- **/
router.post('/create-order', CreateOrder);
router.get('/orders', GetOrders);
router.get('/orderById/:id', GetOrderById);
router.get('/orderByOrderId/:orderId', GetOrderByOrderId);

/** --------------------------- Cart ---------------------------- **/
router.post('/cart', AddCart);
router.get('/cart', GetCart);
router.delete('/cart', DeleteCart);

export { router as OrderRoute };
