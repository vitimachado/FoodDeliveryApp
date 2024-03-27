import { CreateCustomerInputs, CustomerLoginInput, CustomerLoginInputs, CustomerSignature, EditCustomerInputs } from "../dto/Customer.dto";
import { Customer, CustomerDocument } from "../models/Customer";
import { GenerateSalt, GeneratePassword, GenerateSignature, ValidatePassword } from "../utility";
import { BaseDbService } from "./CommonDbService";
import { promiseWrap, validateAndGetInputs } from "../utility/CommonUtility";
import { ErrorHandle } from "../dto/Common.dto";
import { AuthPayload } from "../dto";

class CustomerServiceClass extends BaseDbService<CustomerDocument>{
    constructor() {
        super(Customer);
    }

    private createSignature = async (data: CustomerDocument) => {
        const signature = await GenerateSignature({
            _id: data._id,
            email: data.email,
            verified: data.verified
        });
        return { signature, verified: data.verified, email: data.email };
    }
    
    // Override
    findByUser = async (user: AuthPayload | undefined, reject?: (value: unknown) => void): Promise<CustomerDocument | null>  => {
        if(!user?._id  && reject) {
            reject({ error: 'FindUserError', status: 401, message: 'User not found.' });
            return null;
        }
        const profile = await this.findById(user?._id || '');
        if(!profile?.verified && reject) {
            reject({ error: 'FindUserError', status: 401, message: 'User not verified' });
            return null;
        }
        return profile;
    };

    customerSignUp = async (reqCustomer: CreateCustomerInputs): Promise<CustomerSignature | ErrorHandle> => {
        return promiseWrap(async (resolve, reject) => {
            
                const [inputErrors, customerInputs] = await validateAndGetInputs(CreateCustomerInputs, reqCustomer);
                if(inputErrors.length > 0) {
                    return reject({ error: 'Validation', status: 400, message: inputErrors });
                }

                const salt = await GenerateSalt();
                const password = await GeneratePassword(customerInputs.password, salt);

                const existingUser = await this.findByEmail(reqCustomer.email);

                if(existingUser != null) {
                    return reject({ error: 'CreateError', status: 409, message: 'An user already exist with this email.' })
                }

                const result = await this.dbModel.create({
                    ...customerInputs,
                    password,
                    salt,
                });
            
                if(result) {
                    const signature = await this.createSignature(result);
                    resolve(signature);
                }
                return reject({ error: 'CreateError', status: 500, message: 'Error to create user.' });
        });
    };

    customerSignIn = (loginInput: CustomerLoginInput): Promise<CustomerSignature | ErrorHandle>  => {
        return promiseWrap(async (resolve, reject) => {

                const [inputErrors] = await validateAndGetInputs(CustomerLoginInputs, loginInput);
                if(inputErrors.length > 0) {
                    return reject({ error: 'Validation', status: 400, message: inputErrors });
                }

                const { email, password } = loginInput;

                const result = await this.findByEmail(email);
                if(result !== null) {
                    const validation = await ValidatePassword(password, result.password, result.salt);
                    if(validation) {
                        const signature = await this.createSignature(result);
                        resolve(signature);
                    }
                }
                return reject({ error: 'LoginError', status: 401, message: 'Email or password wrong.' });
        });
    };

    updateCustomer = (user: AuthPayload | undefined, editInput: EditCustomerInputs): Promise<CustomerDocument | ErrorHandle>  => {
        return promiseWrap(async (resolve, reject) => {

                const [inputErrors, customerInputs] = await validateAndGetInputs(EditCustomerInputs, editInput);
                if(inputErrors.length > 0) {
                    return reject({ error: 'Validation', status: 400, message: inputErrors });
                }

                const result = await this.findByUser(user, reject);
                if(result !== null) {
                    result.firstName = customerInputs.firstName;
                    result.lastName = customerInputs.lastName;
                    result.address = customerInputs.address;
                    const updatedUser = await result.save();
                    return resolve(updatedUser);
                }
                return reject({ error: 'LoginError', status: 401, message: 'User not logged.' });
        });
    };

    getCustomerProfile = (user: AuthPayload | undefined): Promise<CustomerDocument | ErrorHandle>  => {
        return promiseWrap(async (resolve, reject) => {
                const result = await this.findByUser(user);
                if(result !== null) {
                    resolve(result);
                }
                return reject({ error: 'LoginError', status: 401, message: 'User not logged.' });
        });
    };


    customerVeryfy = (user: AuthPayload | undefined): Promise<CustomerSignature | ErrorHandle>  => {
        return promiseWrap(async (resolve, reject) => {
                const result = await this.findByUser(user);
                if(result !== null) {
                    result.verified = true;
                    const updatedUser = await result.save();
                    const signature = await this.createSignature(updatedUser);
                    resolve(signature);
                }
                return reject({ error: 'LoginError', status: 401, message: 'User not logged.' });
        });
    };
}

const CustomerService = new CustomerServiceClass();

export default CustomerService;
