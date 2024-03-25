import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
    email: string;
    name: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
};

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, default: ''},
    lastName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: Boolean, required: true },
    verified: { type: Boolean, required: true, default: false },
    otp: { type: Number, required: true },
    otp_expiry: { type: Date, required: true, default: new Date() },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.salt;
            delete ret.password;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Customer = mongoose.model<CustomerDocument>('customer', CustomerSchema);

export { Customer };
