import { FilterQuery, Model, QueryOptions, SortOrder, UpdateQuery } from "mongoose";
import { AuthPayload } from "../dto";

type QuerySort<T> = Record<keyof T, SortOrder>;
type Sort<T> = Partial<QuerySort<T>>;

interface QueryFind<T> {
    filter?: FilterQuery<T>;
    sort?: Sort<T>;
    populate?: any;
    limit?: number;
}
   
const findQuery = <T>(dbModel: Model<T>, options?: QueryFind<T>): Promise<any>  => {
    const { filter, sort, populate, limit } = options || {};
    return dbModel
        .find(filter || {})
        .sort(sort as QuerySort<T>)
        .populate(populate || '')
        .limit(limit || 0);
};
   
const findOneQuery = <T>(dbModel: Model<T>, options?: QueryFind<T>): Promise<any>  => {
    const { filter, populate } = options || {};
    return dbModel
        .findOne(filter || {})
        .populate(populate || '')
};

 export class BaseDbService<T> {
    protected dbModel!: Model<T>;

    constructor(dbModel: Model<T>) {
        this.dbModel = dbModel;
    }
    
    private findQuery = async (options?: QueryFind<T>, findOne = false): Promise<T>  => {
        return findOne ? await findOneQuery(this.dbModel, options) :
                        await findQuery(this.dbModel, options);
    };

    find = (filter?: FilterQuery<T>, sort?: Sort<T>, limit?: number | null, populate?: any): Promise<any>  => {
        return this.findQuery({ filter, sort, limit: limit || 0, populate });
    };

    findObjectQuery = (objQuery: { filter?: FilterQuery<T>; sort?: Sort<T>; limit?: number; populate?: any }): Promise<any>  => {
        return this.findQuery(objQuery);
    };

    findOne = (filter: FilterQuery<T>, populate?: any): Promise<T>  => {
        return this.findQuery({ filter, populate }, true)
    };

    findById = (id: string, populate?: any): Promise<T>  => {
        const filter = { _id: id } as FilterQuery<T>;
        return this.findQuery({ filter, populate }, true);
    };

    findByIdAndUpdate = (id: string | undefined, editValues: UpdateQuery<T>, options: QueryOptions<T> = { returnDocument: 'after' }): Promise<any>  => {
        return new Promise((resolve, reject) => {
            if(!id) {
                return reject("Call Without Id.");
            }
            (async () => {
                try {
                    const restaurant = await this.dbModel.findByIdAndUpdate(id, editValues, options);
                    if(restaurant === null) {
                        return reject("Data not available.");
                    }
                    resolve(restaurant);
                } catch (error) {
                    return reject("Data not available.");
                }
            })()
        });
    };

    findByUser = (user: AuthPayload | undefined): Promise<T | null>  => {
        if(!user?._id) {
            throw new Error('User not found');
        }
        return this.findById(user?._id || '');
    };

    findByEmail = (email: string | undefined) => {
        if(!email) {
            throw new Error('Email mus be passed.');
        }
        return this.findOne({ email } as FilterQuery<T>);
    };
}
