import { AuthPayload } from "../dto";
import { DocumentDTO } from "../dto/Common.dto";
import { OrderInputs } from "../dto/Order.dto";
import { Customer, CustomerDocument } from "../models/Customer";
import { Order, OrderDocument, OrderItemAmount } from "../models/Order";
import { promiseWrap } from "../utility/CommonUtility";
import { BaseDbService } from "./CommonDbService";
import CustomerService from "./CustomerService";
import FoodService from "./FoodServices";

class OrderServiceClass extends BaseDbService<OrderDocument>{
    constructor() {
        super(Order);
    }

    createOrder = async (user: AuthPayload | undefined, orders: [OrderInputs]): Promise<OrderDocument | undefined>  => {
        return promiseWrap(async (resolve, reject) => {
            if (user) {
                const orderID = `${Math.floor(Math.random() * 89999) + 1000}`;
                const amountOrders = await FoodService.getFoodsByOrdersAmount(orders);
                const createdOrder = await Order.create({
                    orderID,
                    items: amountOrders.items,
                    totalAmount: amountOrders.totalAmount,
                    orderStatus: 'Created'
                });

                if(createdOrder) {
                    const profile = await CustomerService.findByUser(user, reject);
                    if(profile) {
                        profile.orders.push(createdOrder);
                        await profile.save();
                        return resolve(createdOrder);
                    }
                }
            }
            return reject({ error: 'CreateError', status: 500, message: 'Error creating order.' });
        });
    };

    getOrders = (user?: AuthPayload): Promise<OrderDocument[]>  => {
        return CustomerService.findObjectQuery({
            filter: { _id: user?._id },
            populate: {
                path: 'orders',
                populate: {
                    path: 'items.food'
                }
            }
        });
    };

    getOrderById = (id?: string): Promise<OrderDocument[]>  => {
        return this.findObjectQuery({
            filter: { _id: id },
            populate: {
                path: 'items.food'
            }
        });
    };

    getOrderByOrderId = (id?: string): Promise<OrderDocument[]>  => {
        return this.findObjectQuery({
            filter: { orderID: id },
            populate: {
                path: 'items.food'
            }
        });
    };
}

const OrderService = new OrderServiceClass();

export default OrderService;
