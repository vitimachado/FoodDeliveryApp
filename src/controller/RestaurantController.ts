import { NextFunction, Request, Response } from "express";
import { EditRestaurantInput, RestaurantLoginInput } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import RestaurantService from "../services/RestaurantService";
import FoodService from "../services/FoodServices";
import { responseHandle } from "../utility/CommonUtility";

export const RestaurantLogin = (req: Request, res: Response, next: NextFunction) => {
    const restaurant = <RestaurantLoginInput>req.body;
    responseHandle(res, RestaurantService.restaurantLogin(restaurant));
};

export const GetRestaurantProfile = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, RestaurantService.restaurantProfile(req?.user));
};

export const GetRestaurantAndFoods = async (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, RestaurantService.getAvailableFoods(req?.user?._id));
};

export const UpdateRestaurantProfile = (req: Request, res: Response, next: NextFunction) => {
    const editRestaurant = <EditRestaurantInput>req.body;
    responseHandle(res, RestaurantService.updateRestaurantProfile(req.user, editRestaurant));
};

export const UpdateRestaurantService = (req: Request, res: Response, next: NextFunction) => {
    const editRestaurant = <EditRestaurantInput>req.body;
    responseHandle(res, RestaurantService.updateRestaurantService(req.user));
};

export const AddFood = (req: Request, res: Response, next: NextFunction) => {
    const foodRestaurant = <CreateFoodInputs>req.body;
    responseHandle(res, RestaurantService.addFoodRestaurant(req.user, foodRestaurant));
};

export const GetFoods = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, FoodService.getFoods(req.user));
};

export const GetRestaurantOrders = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, RestaurantService.getOrders(req.user));
};

export const ProcessRestaurantOrder = (req: Request, res: Response, next: NextFunction) => {
    const foodRestaurant = <CreateFoodInputs>req.body;
    responseHandle(res, RestaurantService.addFoodRestaurant(req.user, foodRestaurant));
};

export const GetRestaurantOrder = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, FoodService.getFoods(req.user));
};
