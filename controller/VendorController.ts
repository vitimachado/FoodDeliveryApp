import { NextFunction, Request, Response } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import VendorService from "../services/VendorService";
import FoodService from "../services/FoodServices";
import { responseHandle } from "../utility/CommonUtility";

export const VendorLogin = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <VendorLoginInput>req.body;
    responseHandle(res, VendorService.vendorLogin(vendor));
};

export const GetVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, VendorService.vendorProfile(req.user));
};

export const UpdateVendorProfile = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    responseHandle(res, VendorService.updateVendorProfile(req.user, editVendor));
};

export const UpdateVendorService = (req: Request, res: Response, next: NextFunction) => {
    const editVendor = <EditVendorInput>req.body;
    responseHandle(res, VendorService.updateVendorService(req.user));
};

export const AddFood = (req: Request, res: Response, next: NextFunction) => {
    const foodVendor = <CreateFoodInputs>req.body;
    responseHandle(res, VendorService.addFoodVendor(req.user, foodVendor));
};

export const GetFoods = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, FoodService.getFoods(req.user));
};
