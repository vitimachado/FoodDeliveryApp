import { AuthPayload } from "../dto";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food, FoodDocument } from "../models/Food";
import { BaseDbService } from "./CommonDbService";

class FoodServiceClass extends BaseDbService<FoodDocument>{
    constructor() {
        super(Food);
    }

    createFood = (restaurantId: string, food: CreateFoodInputs): Promise<DocumentDTO<FoodDocument>>  => {
        return this.dbModel.create({ ...food, restaurantId });
    };

    getFoods = (user?: AuthPayload): Promise<FoodDocument[]>  => {
        return this.dbModel.find({ restaurantId: user?._id });
    };
}

const FoodService = new FoodServiceClass();

export default FoodService;
