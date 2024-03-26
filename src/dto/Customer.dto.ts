import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}

export class CustomerLoginInputs {

    @IsEmail()
    email: string;

    @Length(6, 12)
    password: string;
}

export class EditCustomerInputs {

    @Length(3, 16)
    firstName: string;

    @Length(3, 16)
    lastName: string;

    @Length(6, 26)
    address: string;
}


export interface CustomerLoginInput {
    email: string;
    password: string;
}

export interface CustomerPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export interface CustomerSignature {
    signature: string;
    email: string;
    verified: boolean;
}
