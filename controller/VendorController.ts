import { NextFunction, Request, Response } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { addFoodVendor, updateVendorProfile, updateVendorService, vendorLogin, vendorProfile } from "../services";
import { CreateFoodInputs } from "../dto/Food.dto";
import { getFoods } from "../services/FoodServices";

export const VendorLogin = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <VendorLoginInput>req.body;
    vendorLogin(vendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    vendorProfile(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const UpdateVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    updateVendorProfile(req.user, editVendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const UpdateVendorService = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    updateVendorService(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const AddFood = (req: Request, res: Response, next: NextFunction) => {
    const foodVendor = <CreateFoodInputs>req.body;
    addFoodVendor(req.user, foodVendor)
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
