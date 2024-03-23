import { AuthPayload, CreateVendorInput, EditVendorInput, VendorLoginInput } from "../dto";
import { Vendor, VendorDocument } from "../models";
import { Document } from "mongoose";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";

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

const findOneByIdAndUpdate = (id: string | undefined, editValues: Partial<VendorDocument>): Promise<Document<VendorDocument> | null>  => {
    return new Promise((resolve, reject) => {
        if(!id) {
            reject("Call Without Id.");
        }
        (async () => {
            try {
                const vendor = await Vendor.findByIdAndUpdate(id, editValues, { returnDocument: 'after' });
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

export const vendorProfile = (user?: AuthPayload): Promise<Document<VendorDocument>>  => {
    return new Promise((resolve, reject) => {
        if(user) {
            const vendor = findVendorById(user._id);
            if(vendor !== null) {
                resolve(vendor as Promise<Document<VendorDocument>>);
            }
        }
        reject("Profile Not Found.");
    });
};

export const updateVendorProfile = (user: AuthPayload | undefined, editVendor: EditVendorInput): Promise<Document<VendorDocument> | null>  => {
    return findOneByIdAndUpdate(user?._id, editVendor);
};

export const updateVendorService = (user: AuthPayload | undefined): Promise<Document<VendorDocument> | null>  => {
    return new Promise((resolve, reject) => {
        if(user) {
            (async () => {
                const vendor = await findVendorById(user._id);
                if(vendor) {
                    vendor.serviceAvailable = !vendor.serviceAvailable;
                    const result = await vendor.save();
                    resolve(result);
                }
            })();
        }
        else {
            reject("Profile Not Found.");
        }
    });
};