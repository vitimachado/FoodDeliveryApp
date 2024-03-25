import { NextFunction, Request, Response } from "express";
import CustomerService from "../services/CustomerService";
import { CreateCustomerInputs } from "../dto/Customer.dto";

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <CreateCustomerInputs>req.body;
    CustomerService.customerSignup(customerInputs)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const CustomerLogin = (req: Request, res: Response, next: NextFunction) => {

};

export const CustomerVerify = (req: Request, res: Response, next: NextFunction) => {

};

export const RequestOtp = (req: Request, res: Response, next: NextFunction) => {

};

export const GetCustomerProfile = (req: Request, res: Response, next: NextFunction) => {

};

export const EditCustomerProfile = (req: Request, res: Response, next: NextFunction) => {

};
