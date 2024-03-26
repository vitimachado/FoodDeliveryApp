import { NextFunction, Request, Response } from "express";
import CustomerService from "../services/CustomerService";
import { CreateCustomerInputs, CustomerLoginInput, EditCustomerInputs } from "../dto/Customer.dto";
import { responseHandle } from "../utility/CommonUtility";

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <CreateCustomerInputs>req.body;
    responseHandle(res, CustomerService.customerSignUp(customerInputs));
};

export const CustomerLogin = (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <CustomerLoginInput>req.body;
    responseHandle(res, CustomerService.customerSignIn(customerInputs))
};

export const CustomerVerify = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, CustomerService.customerVeryfy(req.user));
};

export const GetCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, CustomerService.getCustomerProfile(req.user));
};

export const EditCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <EditCustomerInputs>req.body;
    responseHandle(res, CustomerService.updateCustomer(req.user, customerInputs));
};
