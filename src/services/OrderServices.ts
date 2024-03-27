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

    private adjustCart(cart: OrderItem[], order: OrderInputs, food: FoodDocument) {
        const { _id, unit } = order;
        const indexOfOrder = cart.findIndex(orderCart => orderCart.food._id.toString() === _id);

        if (indexOfOrder < 0 && unit > 0) { // Not found an order and has units to add - Add new order
            return [...cart, { food, unit }];
        }
        else if (indexOfOrder >= 0 && unit === 0) { // Found a order and zero units - Delete order
            return cart.filter(orderCart => orderCart.food._id.toString() !== _id);
        }
        else if (indexOfOrder >= 0 && unit > 0) { // Found a order and has units to add - Edit order
            cart[indexOfOrder] = { food, unit };
            return cart
        }
        return null;
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

    getCartByUser = (user: AuthPayload | undefined): Promise<OrderDocument[]>  => {
        return promiseWrap(async (resolve, reject) => {
            CustomerService.findById(user?._id, 'cart.food')
            .then(customer => {
                return resolve(customer?.cart);
            })
            .catch(err => {
                return reject({ error: 'GetError', status: 500, message: 'Error getting cart.' });
            });
        });
    };

    addOrderCart = async (user: AuthPayload | undefined, order: OrderInputs): Promise<OrderDocument | undefined>  => {
        return promiseWrap(async (resolve, reject) => {
            if (user) {
                const food = await FoodService.findById(order._id);

                if(food) {
                    const profile = await CustomerService.findById(user._id, 'cart.food');
                    const cart = profile.cart;

                    const newCart = this.adjustCart(cart, order, food);
                    if(newCart) {
                        profile.cart = newCart;
                        const result = await profile.save();
                        return resolve(result.cart);
                    }
                    else {
                        return resolve(cart);
                    } 
                }
                else {
                    return reject({ error: 'CreateError', status: 500, message: 'Food Not Found.' });
                }
            }
            return reject({ error: 'CreateError', status: 500, message: 'Error added cart.' });
        });
    };

    deleteCartByUser = (user: AuthPayload | undefined): Promise<OrderDocument[]>  => {
        return promiseWrap(async (resolve, reject) => {
            const profile = await CustomerService.findById(user?._id);
            profile.cart = [];
            await profile.save()
            .then((result) => {
                return resolve(result);
            })
            .catch(() => reject({ error: 'DeleteError', status: 500, message: 'Error delete cart.' }));
        });
    };
}

const OrderService = new OrderServiceClass();

export default OrderService;
