import mongoose, { Schema, Document } from "mongoose";
import { FoodDocument } from "./Food";

export interface OrderItem {
    food: FoodDocument;
    unit: Number;
};

export interface OrderItemAmount {
    totalAmount: Number;
    items: [OrderItem];
};

export interface OrderDocument extends Document {
    orderID: String;
    items: [OrderItem];
    totalAmount: Number;
    orderDate?: Date;
    paidMethod?: String; // Credit Card, Wallet
    paymentResponse?: Number;
    orderStatus?: String;
};

const OrderSchema = new Schema({
    orderID: { type: String, required: true },
    items: [
        {
            food: { type: Schema.Types.ObjectId, ref: "food", required: true },
            unit: { type: Number, required: true  }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now() },
    paidMethod: { type: [String] },
    paymentResponse: { type: Number },
    orderStatus: { type: String }
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Order = mongoose.model<OrderDocument>('order', OrderSchema);

export { Order };
