import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import VendorService from "../services/VendorService";
import { responseHandle } from "../utility/CommonUtility";

export const CreateVendor = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <CreateVendorInput>req.body;
    responseHandle(res, VendorService.createVendorService(vendor));
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, VendorService.find());
};

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    responseHandle(res, VendorService.findById(id));
};
