import { NextFunction, Request, Response } from "express";
import { CreateRestaurantInputs } from "../dto";
import RestaurantService from "../services/RestaurantService";
import { responseHandle } from "../utility/CommonUtility";

export const CreateRestaurant = (req: Request, res: Response, next: NextFunction) => {
    const restaurant = <CreateRestaurantInputs>req.body;
    responseHandle(res, RestaurantService.createRestaurantService(restaurant));
};

export const GetRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, RestaurantService.find());
};

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    responseHandle(res, RestaurantService.findById(id));
};
