import { NextFunction, Request, Response } from "express";
import VendorService from "../services/VendorService";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    VendorService.getAvailableFoods(pinCode)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const GetTopRestaturants = async (req: Request, res: Response, next: NextFunction) => {

};

export const GetFoodAvaiable30Min = async (req: Request, res: Response, next: NextFunction) => {

};

export const GetSearchFood = async (req: Request, res: Response, next: NextFunction) => {

};

export const FindRestaurantById = async (req: Request, res: Response, next: NextFunction) => {

};
