import { AuthPayload, CreateVendorInput, EditVendorInput, VendorLoginInput } from "../dto";
import { Vendor, VendorDocument } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { createFood } from "./FoodServices";
import { BaseDbService } from "./CommonDbService";

class VendorServiceClass extends BaseDbService<VendorDocument>{
    constructor() {
        super(Vendor);
    }

    findByEmail = (email: string | undefined) => {
        return this.findOne({ email });
    };
        
    createVendorService = (vendor: CreateVendorInput): Promise<DocumentDTO<VendorDocument>>  => {
        return new Promise((resolve, reject) => {
            (async () => { 
                const hasVendor = await this.findByEmail(vendor.email);
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

    vendorLogin = (vendor: VendorLoginInput): Promise<string>  => {
        const { email, password } = vendor;
        return new Promise((resolve, reject) => {
            (async () => {
                const hasVendor = await this.findByEmail(email);
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

    getVendorByUser = (user: AuthPayload | undefined): Promise<DocumentDTO<VendorDocument>>  => {
        if(!user?._id) {
            throw new Error('User not found');
        }
        return this.findById(user?._id || '');
    };

    vendorProfile = (user?: AuthPayload): Promise<DocumentDTO<VendorDocument>>  => {
        return this.getVendorByUser(user);
    };

    updateVendorProfile = (user: AuthPayload | undefined, editVendor: EditVendorInput): Promise<DocumentDTO<VendorDocument> | null>  => {
        return this.findByIdAndUpdate(user?._id, editVendor);
    };

    updateVendorService = (user: AuthPayload | undefined): Promise<DocumentDTO<VendorDocument>>  => {
        return this.getVendorByUser(user)
            .then((vendor) => {
                vendor.serviceAvailable = !vendor.serviceAvailable;
                return vendor.save();
            });
    };

    addFoodVendor = (user: AuthPayload | undefined, foodInputs: CreateFoodInputs): Promise<DocumentDTO<VendorDocument>>  => {
        return this.getVendorByUser(user)
            .then(async (vendor) => {
                const food = await createFood(vendor._id, foodInputs);
                vendor.foods.push(food);
                return vendor.save();
            });
    };
}

const VendorService = new VendorServiceClass();

export default VendorService;
