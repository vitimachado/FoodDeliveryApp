import { NextFunction, Request, Response } from "express";
import RestaurantService from "../services/RestaurantService";
import { responseHandle } from "../utility/CommonUtility";

export const GetRestaurantFoodsAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    responseHandle(res, RestaurantService.getAvailableFoods(id));
};

export const GetTopRestaturants = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const limit = Number(req.params.limit || 0);
    responseHandle(res, RestaurantService.getTopRestaturants(id, limit));
};

export const GetFoodsAvaiableByReadyTime = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const lessThan = Number(req.params.lessThan || 30);
    responseHandle(res, RestaurantService.getFoodAvaiableByReadyTime(id, lessThan));
};

export const GetSearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const foods = <string[]>req.body;
    responseHandle(res, RestaurantService.getFoods(id, foods));
};
