import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor, VendorDocument } from "../models";
import { Document } from "mongoose";
import { GeneratePassword, GenerateSalt } from "../utility";

const findOne = async <T>(filter: Partial<T>) => {
    return await Vendor.findOne(filter);
};

const CreateVendorService = (vendor: CreateVendorInput): Promise<Document<VendorDocument>>  => {
    return new Promise((resolve, reject) => {
        (async () => { 
            const hasVendor = await findOne({ email: vendor.email });
            if(hasVendor !== null) {
                reject("This email is already in use.");
            }
            const salt = await GenerateSalt();
            const password = await GeneratePassword(vendor.password, salt);
            const createVendor = await Vendor.create({ ...vendor, salt, password });
            resolve(createVendor);
        })()
    });
};

const findOneById = async <T>(id: string) => {
    return await findOne({ id });
};


export const CreateVendor = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <CreateVendorInput>req.body;
    CreateVendorService(vendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {

};

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
};
