import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import VendorService from "../services/VendorService";

export const CreateVendor = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <CreateVendorInput>req.body;
    VendorService.createVendorService(vendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    VendorService.find()
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    VendorService.findById(id)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};
