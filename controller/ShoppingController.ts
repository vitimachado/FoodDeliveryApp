import { NextFunction, Request, Response } from "express";
import VendorService from "../services/VendorService";
import { responseHandle } from "../utility/CommonUtility";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    responseHandle(res, VendorService.getAvailableFoods(pinCode));
};

export const GetTopRestaturants = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const limit = Number(req.params.limit || 0);
    responseHandle(res, VendorService.getTopRestaturants(pinCode, limit));
};

export const GetFoodsAvaiableByReadyTime = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const lessThan = Number(req.params.lessThan || 30);
    responseHandle(res, VendorService.getFoodAvaiableByReadyTime(pinCode, lessThan));
};

export const GetSearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const foods = <string[]>req.body;
    responseHandle(res, VendorService.getFoods(pinCode, foods));
};

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    responseHandle(res, VendorService.getRestaurantById(id));
};
