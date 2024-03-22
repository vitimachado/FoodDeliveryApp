import { NextFunction, Request, Response } from "express";
import { CreateVendorInput, VendorLoginInput } from "../dto/Vendor.dto";
import { Vendor, VendorDocument } from "../models";
import { Document } from "mongoose";
import { GeneratePassword, GenerateSalt, ValidatePassword } from "../utility";

const findOne = async <T>(filter: Partial<T>) => {
    return await Vendor.findOne(filter);
};

const find = async <T>() => {
    return await Vendor.find();
};

const findOneById = <T>(id: string) => {
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

export const findVendors = (): Promise<Document<VendorDocument>[]>  => {
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

export const findVendor = async <T>(id: string | undefined | null, email?: string | undefined): Promise<Document<VendorDocument> | null> => {
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

export const findVendorById = <T>(id: string | undefined) => {
    return findOne({ _id: id });
};

export const findVendorByEmail = <T>(email: string | undefined) => {
    return findOne({ email });//findVendor(null, email);
};

export const createVendorService = (vendor: CreateVendorInput): Promise<Document<VendorDocument>>  => {
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

export const vendorLogin = (vendor: VendorLoginInput): Promise<Document<VendorDocument> | null>  => {
    const { email, password } = vendor;
    return new Promise((resolve, reject) => {
        (async () => {
            const hasVendor = await findVendorByEmail(email);
            if(hasVendor !== null) {
                const validation = await ValidatePassword(password, hasVendor.password, hasVendor.salt);
                if(validation) {
                    resolve(hasVendor);
                }
            }
            reject("The email or password is wrong.");
        })()
    });
};

