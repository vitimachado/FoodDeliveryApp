import { Document, Types } from "mongoose";

export type DocumentDTO<T> = Document<unknown, {}, T> & T & {
    _id: Types.ObjectId;
};

export interface ErrorHandle {
    error: string;
    status: number;
    message: string;
}
