import { FilterQuery, Model, QueryOptions, SortOrder, UpdateQuery } from "mongoose";

interface QueryFind<T> {
    filter?: FilterQuery<T>;
    sort?: Record<string, SortOrder>;
    populate?: string;
}
   
const findQuery = <T>(dbModel: Model<T>, options?: QueryFind<T>): Promise<any>  => {
    const { filter, sort, populate } = options || {};
    return dbModel.find(filter || {}).sort(sort).populate(populate || '');
};
   
const findOneQuery = <T>(dbModel: Model<T>, options?: QueryFind<T>): Promise<any>  => {
    const { filter, sort, populate } = options || {};
    return dbModel.findOne(filter || {}).sort(sort).populate(populate || '');
};

export class BaseDbService<T> {
    protected dbModel!: Model<T>;

    constructor(dbModel: Model<T>) {
        this.dbModel = dbModel;
    }
    
    private findQuery = (options?: QueryFind<T>, findOne = false): Promise<any>  => {
        return new Promise((resolve, reject) => {
            (async () => { 
                try {
                    const result = findOne ? await findOneQuery(this.dbModel, options) :
                                            await findQuery(this.dbModel, options);
                    if(result === null) {
                        reject("Data not available.");
                    }
                    resolve(result);
                } catch (error) {
                    reject("Data not available.");
                }
            })();
        });
    };

    find = (filter?: FilterQuery<T>, sort?: Record<string, SortOrder>, populate?: string): Promise<any>  => {
        return this.findQuery({ filter, sort, populate });
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
}
