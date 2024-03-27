import mongoose, { Schema, Document } from "mongoose";
import { OrderDocument } from "./Order";

export interface RestaurantDocument extends Document {
    name: string;
    ownerName: string;
    foodTypes: [string];
    pinCode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImage: [string];
    rating: number;
    foods: any;
    orders: [OrderDocument];
};

const RestaurantSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String], default: [] },
    pinCode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, default: '' },
    serviceAvailable: { type: Boolean, default: false },
    coverImage: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }],
    orders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'order'
    }]
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

const Restaurant = mongoose.model<RestaurantDocument>('restaurant', RestaurantSchema);

export { Restaurant };
