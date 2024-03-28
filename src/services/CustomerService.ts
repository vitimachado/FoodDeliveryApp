import { CreateCustomerInputs, CustomerLoginInput, CustomerLoginInputs, CustomerSignature, EditCustomerInputs } from "../dto/Customer.dto";
import { Customer, CustomerDocument } from "../models/Customer";
import { GenerateSalt, GeneratePassword, GenerateSignature, ValidatePassword } from "../utility";
import { BaseDbService } from "./CommonDbService";
import { promiseWrap, validateAndGetInputs } from "../utility/CommonUtility";
import { ErrorHandle } from "../dto/Common.dto";
import { AuthPayload } from "../dto";
import { OrderInputs } from "../dto/Order.dto";
import { OrderDocument, OrderItem } from "../models/Order";
import FoodService from "./FoodServices";
import { FoodDocument } from "../models/Food";

class CustomerServiceClass extends BaseDbService<CustomerDocument>{
    constructor() {
        super(Customer);
    }

    private adjustCart(cart: OrderItem[], order: OrderInputs, food: FoodDocument) {
        const { _id, unit } = order;
        const indexOfOrder = cart.findIndex(orderCart => orderCart.food._id.toString() === _id);

        if (indexOfOrder < 0 && unit > 0) { // Not found an order and has units to add - Add new order
            return [...cart, { food, unit }];
        }
        else if (indexOfOrder >= 0 && unit === 0) { // Found a order and zero units - Delete order
            return cart.filter(orderCart => orderCart.food._id.toString() !== _id);
        }
        else if (indexOfOrder >= 0 && unit > 0) { // Found a order and has units to add - Edit order
            cart[indexOfOrder] = { food, unit };
            return cart
        }
        return null;
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

    ///////////////////////////////// Cart and Orders //////////////////////////////////
    
    getCustomerOrders = (user: AuthPayload | undefined): Promise<OrderDocument[]>  => {
        return promiseWrap(async (resolve, reject) => {
            CustomerService.findById(user?._id, 'orders')
            .then(customer => {
                return resolve(customer?.orders);
            })
            .catch(err => {
                return reject({ error: 'GetError', status: 500, message: 'Error getting orders.' });
            });
        });
    };
    
    getCartByUser = (user: AuthPayload | undefined): Promise<OrderDocument[]>  => {
        return promiseWrap(async (resolve, reject) => {
            CustomerService.findById(user?._id, 'cart.food')
            .then(customer => {
                return resolve(customer?.cart);
            })
            .catch(err => {
                return reject({ error: 'GetError', status: 500, message: 'Error getting cart.' });
            });
        });
    };

    addOrderCart = async (user: AuthPayload | undefined, order: OrderInputs): Promise<OrderDocument | undefined>  => {
        return promiseWrap(async (resolve, reject) => {
            if (user) {
                const food = await FoodService.findById(order._id);

                if(food) {
                    const profile = await CustomerService.findById(user._id, 'cart.food');
                    const cart = profile.cart;

                    const newCart = this.adjustCart(cart, order, food);
                    if(newCart) {
                        profile.cart = newCart;
                        const result = await profile.save();
                        return resolve(result.cart);
                    }
                    else {
                        return resolve(cart);
                    } 
                }
                else {
                    return reject({ error: 'CreateError', status: 500, message: 'Food Not Found.' });
                }
            }
            return reject({ error: 'CreateError', status: 500, message: 'Error added cart.' });
        });
    };

    deleteCartByUser = (user: AuthPayload | undefined): Promise<OrderDocument[]>  => {
        return promiseWrap(async (resolve, reject) => {
            const profile = await CustomerService.findById(user?._id);
            profile.cart = [];
            await profile.save()
            .then((result) => {
                return resolve(result);
            })
            .catch(() => reject({ error: 'DeleteError', status: 500, message: 'Error delete cart.' }));
        });
    };
}

const CustomerService = new CustomerServiceClass();

export default CustomerService;
