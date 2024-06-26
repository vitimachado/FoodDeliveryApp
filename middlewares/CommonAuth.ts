import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto";
import { ValidateSignature } from "../utility";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validate = await ValidateSignature(req);
    
        if(validate) {
            next();
        }
        else {
            return res.json({ error: 'Not Authorized' });
        }
    } catch (error) {
        return res.json({ error: 'Not Authorized' });
    }
};

