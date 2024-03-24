import { AuthPayload } from "../dto";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food, FoodDocument } from "../models/Food";
import { BaseDbService } from "./CommonDbService";

class FoodServiceClass extends BaseDbService<FoodDocument>{
    constructor() {
        super(Food);
    }

    createFood = (vendorId: string, food: CreateFoodInputs): Promise<DocumentDTO<FoodDocument>>  => {
        return this.dbModel.create({ ...food, vendorId });
    };

    getFoods = (user?: AuthPayload): Promise<FoodDocument[]>  => {
        return this.dbModel.find({ vendorId: user?._id });
    };
}

const FoodService = new FoodServiceClass();

export default FoodService;
