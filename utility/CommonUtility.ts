import { ClassConstructor, plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";

type PromiseCall = (res: (value: unknown) => void, rej: (value: unknown) => void) => any;

export const promiseWrap = (asyncFunction: PromiseCall): any => {
    return new Promise((resolve, reject) => {
        try {
            asyncFunction(resolve, reject);
        } catch (error) {
            reject(error);
        }
    });
};

export const checkInArrayIfHasString = (str: string, arrString: string[]): boolean =>{
    return arrString.some(substr => str.includes(substr));
}


export const validateAndGetInputs = async <T = any>(classInputs: ClassConstructor<T>, reqCustomer: any): Promise<[ValidationError[], T]> => {
    const customerInputs = plainToClass(classInputs, reqCustomer) as object;
    const inputErrors = await validate(customerInputs, { validationError: { target: true }});
    return [inputErrors, customerInputs as T];
}
