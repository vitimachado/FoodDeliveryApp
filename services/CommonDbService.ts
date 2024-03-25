import { FilterQuery, Model, QueryOptions, SortOrder, UpdateQuery } from "mongoose";
import { AuthPayload } from "../dto";

type QuerySort<T> = Record<keyof T, SortOrder>;
type Sort<T> = Partial<QuerySort<T>>;

interface QueryFind<T> {
    filter?: FilterQuery<T>;
    sort?: Sort<T>;
    populate?: string;
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
    
    private findQuery = async (options?: QueryFind<T>, findOne = false): Promise<any>  => {
        return findOne ? await findOneQuery(this.dbModel, options) :
                        await findQuery(this.dbModel, options);
    };

    find = (filter?: FilterQuery<T>, sort?: Sort<T>, limit?: number | null, populate?: string): Promise<any>  => {
        return this.findQuery({ filter, sort, limit: limit || 0, populate });
    };

    findOne = (filter: FilterQuery<T>, populate?: string): Promise<any>  => {
        return this.findQuery({ filter, populate }, true)
    };

    findById = (id: string, populate?: string): Promise<any>  => {
        return this.findQuery({ filter: { _id: id }, populate}, true);
    };

    findByIdAndUpdate = (id: string | undefined, editValues: UpdateQuery<T>, options: QueryOptions<T> = { returnDocument: 'after' }): Promise<any>  => {
        return new Promise((resolve, reject) => {
            if(!id) {
                reject("Call Without Id.");
            }
            (async () => {
                try {
                    const vendor = await this.dbModel.findByIdAndUpdate(id, editValues, options);
                    if(vendor === null) {
                        reject("Data not available.");
                    }
                    resolve(vendor);
                } catch (error) {
                    reject("Data not available.");
                }
            })()
        });
    };

    findByUser = <T = any>(user: AuthPayload | undefined): Promise<T>  => {
        if(!user?._id) {
            throw new Error('User not found');
        }
        return this.findById(user?._id || '');
    };

    findByEmail = (email: string | undefined) => {
        return this.findOne({ email });
    };
}
