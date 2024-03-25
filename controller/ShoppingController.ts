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
    const pinCode = req.params.pinCode;
    const limit = Number(req.params.limit || 0);
    VendorService.getTopRestaturants(pinCode, limit)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const GetFoodsAvaiableByReadyTime = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const lessThan = Number(req.params.lessThan || 30);
    VendorService.getFoodAvaiableByReadyTime(pinCode, lessThan)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const GetSearchFood = async (req: Request, res: Response, next: NextFunction) => {
    const pinCode = req.params.pinCode;
    const food = req.params.food;
    VendorService.getFoods(pinCode, !!food ? [food] : undefined)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const GetRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    VendorService.getRestaurantById(id)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};
