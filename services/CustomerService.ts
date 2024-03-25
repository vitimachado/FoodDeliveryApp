import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateCustomerInputs } from "../dto/Customer.dto";
import { Customer, CustomerDocument } from "../models/Customer";
import { GenerateSalt, GeneratePassword } from "../utility";
import { BaseDbService } from "./CommonDbService";
import { GenerateOtp } from "../utility/NotificationUtility";

type PromiseCall = (res: (value: unknown) => void, rej: (value: unknown) => void) => void;

const promiseWrap = (asyncFunction: PromiseCall) => {
    return new Promise((resolve, reject) => {
        asyncFunction(resolve, reject);
    });
};

class CustomerServiceClass extends BaseDbService<CustomerDocument>{
    constructor() {
        super(Customer);
    }

    customerSignup = async (reqCustomer: CreateCustomerInputs) => {
        return promiseWrap(async (resolve, reject) => {
                const customerInputs = plainToClass(CreateCustomerInputs, reqCustomer);
                const inputErrors = await validate(customerInputs, { validationError: { target: true }});
                if(inputErrors.length > 0) {
                    reject(inputErrors);
                }
                const salt = await GenerateSalt();
                const password = await GeneratePassword(customerInputs.password, salt);
            
                const { otp, expiry } = GenerateOtp();

                console.log("🚀 ~ CustomerServiceClass ~ returnpromiseWrap ~ otp:", {
                    ...customerInputs,
                    password,
                    salt,
                    otp,
                    expiry
                })

                resolve('customerSignup...success')

                // const result = await Customer.create({
                //     ...customerInputs,
                //     password,
                //     salt,
                //     otp,
                //     expiry
                // });
            
                // if(result) {
            
                // }
        });
    };
    // customerSignup = async (reqCustomer: CreateCustomerInputs) => {
        
    //     return new Promise((resolve, reject) => {
    //         (async () => {
    //             const customerInputs = plainToClass(CreateCustomerInputs, reqCustomer);
    //             const inputErrors = await validate(customerInputs, { validationError: { target: true }});
    //             if(inputErrors.length > 0) {
    //                 return reject(inputErrors);
    //             }
    //             const salt = await GenerateSalt();
    //             const password = await GeneratePassword(customerInputs.password, salt);
            
    //             const otp = 5698596;
            
    //             const result = await Customer.create({
    //                 ...customerInputs,
    //                 password,
    //                 salt,
    //                 otp
    //             });
            
    //             if(result) {
            
    //             }
    //         })();
    //     });
    // };
}

const CustomerService = new CustomerServiceClass();

export default CustomerService;
