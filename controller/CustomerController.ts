import { NextFunction, Request, Response } from "express";
import CustomerService from "../services/CustomerService";
import { CreateCustomerInputs, CustomerLoginInput, EditCustomerInputs } from "../dto/Customer.dto";

export const responseHandle = async (res: Response, promiseHandle: Promise<any>) => {
    promiseHandle
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(err?.status || 400).json({ message: err });
    });
};

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <CreateCustomerInputs>req.body;
    CustomerService.customerSignUp(customerInputs)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(400).json({ message: err });
    });
};

export const CustomerLogin = (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <CustomerLoginInput>req.body;
    CustomerService.customerSignIn(customerInputs)
    .then(result => {
        return res.status(200).json(result);
    })
    .catch(err => {
        return res.status(err?.status || 400).json({ message: err });
    });
};

export const CustomerVerify = (req: Request, res: Response, next: NextFunction) => {
    CustomerService.customerVeryfy(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const GetCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
    CustomerService.getCustomerProfile(req.user)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};

export const EditCustomerProfile = (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = <EditCustomerInputs>req.body;
    CustomerService.updateCustomer(req.user, customerInputs)
    .then((result) => {
        return res.json(result);
    }).catch((err) => {
        return res.json({ error: err });
    });
};
