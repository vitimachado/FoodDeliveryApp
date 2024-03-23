import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthPayload, VendorPayload } from "../dto";
import { APP_SECRET_JWT } from "../config";
import { Request } from "express";

export const GenerateSalt = async () => {
    return bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return bcrypt.hash(password, salt);
};

export const ValidatePassword = async (password: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(password, salt) === savedPassword;
};

export const GenerateSignature = async (payload: VendorPayload) => {
    return jwt.sign(payload, APP_SECRET_JWT, { expiresIn: '1d' });
};

export const ValidateSignature = async (req: Request) => {
    const singnature = req.get('Authorization');

    if(singnature) {
        const payload = await jwt.verify(singnature.split(' ')[1], APP_SECRET_JWT) as AuthPayload;
        
        req.user = payload;
        
        return true;
    }
    return false;
};

