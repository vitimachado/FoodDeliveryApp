import { Length, IsEmail } from "class-validator";

export class CreateRestaurantInputs {
    @Length(3, 16)
    name: string;

    @Length(3, 16)
    ownerName: string;

    @Length(6, 26)
    address: string;

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}

export interface EditRestaurantInput {
    name: string;
    address: string;
    phone: string;
    foodTypes: [string];
}

export interface RestaurantLoginInput {
    email: string;
    password: string;
}

export interface RestaurantPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
}
