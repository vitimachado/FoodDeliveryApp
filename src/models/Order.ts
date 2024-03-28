import mongoose, { Schema, Document } from "mongoose";
import { FoodDocument } from "./Food";
import { OrderStatus } from "../dto/Order.dto";

export interface OrderItem {
    food: FoodDocument;
    unit: Number;
};

export interface OrderItemAmount {
    restaurantId?: String;
    totalAmount: Number;
    items: OrderItem[];
};

export interface OrderDocument extends Document {
    orderID: String;
    restaurantId: String;
    deliveryId?: String;
    items: OrderItem[];
    totalAmount: Number;
    orderDate?: Date;
    paidMethod?: String; // Credit Card, Wallet
    paymentResponse?: Number;
    orderStatus?: OrderStatus;
    comment?: String;
    readyTime: number;
};

const OrderSchema = new Schema({
    orderID: { type: String, required: true },
    restaurantId: { type: String, required: true },
    deliveryId: { type: String },
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
    orderStatus: { type: String },
    comment: { type: String },
    readyTime: { type: Number }
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
