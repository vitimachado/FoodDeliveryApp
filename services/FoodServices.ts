import { AuthPayload } from "../dto";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food, FoodDocument } from "../models/Food";

export const createFood = (vendorId: string, food: CreateFoodInputs): Promise<DocumentDTO<FoodDocument>>  => {
    return Food.create({ ...food, vendorId });
};

export const getFoods = (user?: AuthPayload): Promise<FoodDocument[]>  => {
    return Food.find({ vendorId: user?._id });
};
