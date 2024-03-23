import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor, VendorDocument } from "../models";
import { Document } from "mongoose";
import { GeneratePassword, GenerateSalt } from "../utility";

const findOne = async <T>(filter: Partial<T>) => {
    return await Vendor.findOne(filter);
};

const find = async <T>() => {
    return await Vendor.find();
};

const findOneById = async <T>(id: string) => {
    return new Promise((resolve, reject) => {
        (async () => { 
            try {
                const vendor = await Vendor.findById(id);
                if(vendor === null) {
                    reject("Data not available.");
                }
                resolve(vendor);
            } catch (error) {
                reject("Data not available.");
            }
        })()
    });
};

const findVendors = (): Promise<Document<VendorDocument>[]>  => {
    return new Promise((resolve, reject) => {
        (async () => { 
            const vendors = await Vendor.find();
            if(vendors === null) {
                reject("Data not available.");
            }
            resolve(vendors);
        })()
    });
};

const findVendor = async <T>(id: string | undefined, email: string | undefined) => {
    return new Promise((resolve, reject) => {
        (async () => { 
            try {
                const filter = email ? { email } : id ? { id } : {};
                const vendor = await Vendor.findOne(filter);
                if(vendor === null) {
                    reject("Data not available.");
                }
                resolve(vendor);
            } catch (error) {
                reject("Data not available.");
            }
        })()
    });
};

const createVendorService = (vendor: CreateVendorInput): Promise<Document<VendorDocument>>  => {
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


export const CreateVendor = (req: Request, res: Response, next: NextFunction) => {
    const vendor = <CreateVendorInput>req.body;
    createVendorService(vendor)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    findVendors()
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    findOneById(id)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};
