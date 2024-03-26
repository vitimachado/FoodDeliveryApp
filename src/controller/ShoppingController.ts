import { NextFunction, Request, Response } from "express";
import RestaurantService from "../services/RestaurantService";
import { responseHandle } from "../utility/CommonUtility";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    responseHandle(res, RestaurantService.getAvailableFoods(pinCode));
};

export const GetTopRestaturants = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const limit = Number(req.params.limit || 0);
    responseHandle(res, RestaurantService.getTopRestaturants(pinCode, limit));
};

export const GetFoodsAvaiableByReadyTime = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const lessThan = Number(req.params.lessThan || 30);
    responseHandle(res, RestaurantService.getFoodAvaiableByReadyTime(pinCode, lessThan));
};

export const GetSearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const foods = <string[]>req.body;
    responseHandle(res, RestaurantService.getFoods(pinCode, foods));
};
