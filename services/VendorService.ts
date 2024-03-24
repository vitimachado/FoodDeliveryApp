import { AuthPayload, CreateVendorInput, EditVendorInput, VendorLoginInput } from "../dto";
import { Vendor, VendorDocument } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { createFood } from "./FoodServices";
import { FilterQuery } from "mongoose";
import { BaseDbService } from "./CommonDbService";

const vendorDb = new BaseDbService<VendorDocument>(Vendor);

const findOneByIdAndUpdate = (id: string | undefined, editValues: Partial<VendorDocument>): Promise<DocumentDTO<VendorDocument> | null>  => {
    return vendorDb.findOneByIdAndUpdate(id, editValues);
};

export const findVendors = (): Promise<DocumentDTO<VendorDocument>[]>  => {
    return vendorDb.find();
};

export const findVendor = (filter: FilterQuery<VendorDocument>): Promise<DocumentDTO<VendorDocument> | null> => {
    return vendorDb.findOne(filter);
};

export const findVendorById = (id: string | undefined) => {
    return vendorDb.findOne({ _id: id });
};

export const findVendorByEmail = (email: string | undefined) => {
    return vendorDb.findOne({ email });
};

export const createVendorService = (vendor: CreateVendorInput): Promise<DocumentDTO<VendorDocument>>  => {
    return new Promise((resolve, reject) => {
        (async () => { 
            const hasVendor = await findVendorByEmail(vendor.email);
            if(hasVendor !== null) {
                reject("This email is already in use.");
            }
            const salt = await GenerateSalt();
            const password = await GeneratePassword(vendor.password, salt);
            const createVendor = await Vendor.create({ foods: [], ...vendor, salt, password });
            resolve(createVendor);
        })()
    });
};

export const vendorLogin = (vendor: VendorLoginInput): Promise<string>  => {
    const { email, password } = vendor;
    return new Promise((resolve, reject) => {
        (async () => {
            const hasVendor = await findVendorByEmail(email);
            if(hasVendor !== null) {
                const validation = await ValidatePassword(password, hasVendor.password, hasVendor.salt);
                if(validation) {
                    const signature = GenerateSignature({
                        _id: hasVendor.id,
                        email: hasVendor.email,
                        foodTypes: hasVendor.foodTypes,
                        name: hasVendor.name
                    })
                    resolve(signature);
                }
            }
            reject("The email or password is wrong.");
        })()
    });
};

export const getVendorByUser = (user: AuthPayload | undefined): Promise<DocumentDTO<VendorDocument>>  => {
    if(!user?._id) {
        throw new Error('User not found');
    }
    return findVendorById(user?._id || '');
};

export const vendorProfile = (user?: AuthPayload): Promise<DocumentDTO<VendorDocument>>  => {
    return getVendorByUser(user);
};

export const updateVendorProfile = (user: AuthPayload | undefined, editVendor: EditVendorInput): Promise<DocumentDTO<VendorDocument> | null>  => {
    return findOneByIdAndUpdate(user?._id, editVendor);
};

export const updateVendorService = (user: AuthPayload | undefined): Promise<DocumentDTO<VendorDocument>>  => {
    return getVendorByUser(user)
        .then((vendor) => {
            vendor.serviceAvailable = !vendor.serviceAvailable;
            return vendor.save();
        });
};

export const addFoodVendor = (user: AuthPayload | undefined, foodInputs: CreateFoodInputs): Promise<DocumentDTO<VendorDocument>>  => {
    return getVendorByUser(user)
        .then(async (vendor) => {
            const food = await createFood(vendor._id, foodInputs);
            vendor.foods.push(food);
            return vendor.save();
        });
};
