import mongoose, { Schema, Document } from "mongoose";

export interface CustomerDocument extends Document {
    email: string;
    password: string;
    name: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    lat: number;
    lng: number;
};

const CustomerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String },
    salt: { type: String, required: true },
    firstName: { type: String, default: ''},
    lastName: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
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
