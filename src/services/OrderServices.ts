import { AuthPayload } from "../dto";
import { OrderInputs } from "../dto/Order.dto";
import { FoodDocument } from "../models/Food";
import { Order, OrderDocument, OrderItem } from "../models/Order";
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
                if(amountOrders?.restaurantId) {
                    const createdOrder = await Order.create({
                        orderID,
                        restaurantId: amountOrders.restaurantId,
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
            }
            return reject({ error: 'CreateError', status: 500, message: 'Error creating order.' });
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

    getOrders = (): Promise<OrderDocument[]>  => {
        return this.dbModel.find().populate('items.food');
    };
}

const OrderService = new OrderServiceClass();

export default OrderService;
