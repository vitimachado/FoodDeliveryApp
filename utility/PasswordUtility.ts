import bcrypt from "bcrypt";

export const GenerateSalt = async () => {
    return bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
    return bcrypt.hash(password, salt);
};

export const ValidatePassword = async (password: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(password, salt) === savedPassword;
};
