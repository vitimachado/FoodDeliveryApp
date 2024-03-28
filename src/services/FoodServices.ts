import { AuthPayload } from "../dto";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { OrderInputs } from "../dto/Order.dto";
import { Food, FoodDocument } from "../models/Food";
import { OrderItem, OrderItemAmount } from "../models/Order";
import { BaseDbService } from "./CommonDbService";

class FoodServiceClass extends BaseDbService<FoodDocument>{
    constructor() {
        super(Food);
    }

    private countAmountFood(orders: [OrderInputs], foodOrders: FoodDocument[]): OrderItemAmount {
        const amountOrders = orders.reduce((acc: any, order: OrderInputs) => {
            const food = foodOrders.find(food => food.id === order._id);
            return !!food ? {
                restaurantId: food.restaurantId,
                totalAmount: acc.totalAmount + (food.price * order.unit),
                items: [...acc.items, { food, unit: order.unit }]
            } : acc;
        }, { totalAmount: 0, items: [] });

        return amountOrders;
    };

    createFood = (restaurantId: string, food: CreateFoodInputs): Promise<DocumentDTO<FoodDocument>>  => {
        return this.dbModel.create({ ...food, restaurantId });
    };

    getFoods = (user?: AuthPayload): Promise<FoodDocument[]>  => {
        return this.dbModel.find({ restaurantId: user?._id });
    };

    getFoodsByOrders = (orders: [OrderInputs]): Promise<FoodDocument[]> => {
        const ordersId = orders.map(order => order._id);
        return this.dbModel.find().where('_id').in(ordersId).exec();
    };

    getFoodsByOrdersAmount = async (orders: [OrderInputs]): Promise<OrderItemAmount> => {
        const foodOrders = await this.getFoodsByOrders(orders);
        return this.countAmountFood(orders, foodOrders);
    };
}

const FoodService = new FoodServiceClass();

export default FoodService;
