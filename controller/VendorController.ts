import { NextFunction, Request, Response } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { getFoods } from "../services/FoodServices";
import VendorService from "../services/VendorService";

export const VendorLogin = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <VendorLoginInput>req.body;
    VendorService.vendorLogin(vendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    VendorService.vendorProfile(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const UpdateVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    VendorService.updateVendorProfile(req.user, editVendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const UpdateVendorService = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    VendorService.updateVendorService(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const AddFood = (req: Request, res: Response, next: NextFunction) => {
    const foodVendor = <CreateFoodInputs>req.body;
    VendorService.addFoodVendor(req.user, foodVendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetFoods = (req: Request, res: Response, next: NextFunction) => {
    getFoods(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};
