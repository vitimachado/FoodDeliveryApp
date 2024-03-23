import { NextFunction, Request, Response } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto";
import { updateVendorProfile, updateVendorService, vendorLogin, vendorProfile } from "../services";

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
