import { AuthPayload, CreateRestaurantInputs, EditRestaurantInput, RestaurantLoginInput } from "../dto";
import { Restaurant, RestaurantDocument } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { BaseDbService } from "./CommonDbService";
import FoodService from "./FoodServices";
import { FoodDocument } from "../models/Food";
import { checkInArrayIfHasString, promiseWrap, validateAndGetInputs } from "../utility/CommonUtility";
import OrderService from "./OrderServices";

class RestaurantServiceClass extends BaseDbService<RestaurantDocument>{
    constructor() {
        super(Restaurant);
    }
        
    createRestaurantService = (restaurant: CreateRestaurantInputs): Promise<DocumentDTO<RestaurantDocument>>  => {
        return promiseWrap(async (resolve, reject) => {
            
                const [inputErrors, restaurantInputs] = await validateAndGetInputs(CreateRestaurantInputs, restaurant);
                if(inputErrors.length > 0) {
                    return reject({ error: 'Validation', status: 400, message: inputErrors });
                }

                const hasRestaurant = await this.findByEmail(restaurantInputs.email);
                if(hasRestaurant !== null) {
                    return reject({ error: 'CreateError', status: 401, message: 'This email is already in use.' });
                }
                const salt = await GenerateSalt();
                const password = await GeneratePassword(restaurantInputs.password, salt);
                const createRestaurant = await this.dbModel.create({ foods: [], ...restaurantInputs, salt, password });
                return resolve(createRestaurant);
        });
    };

    restaurantLogin = (restaurant: RestaurantLoginInput): Promise<string>  => {
        const { email, password } = restaurant;
        return promiseWrap(async (resolve, reject) => {
                const hasUser = await this.findByEmail(email);
                if(hasUser !== null) {
                    const validation = await ValidatePassword(password, hasUser.password, hasUser.salt);
                    if(validation) {
                        const signature = GenerateSignature({
                            _id: hasUser.id,
                            email: hasUser.email,
                            foodTypes: hasUser.foodTypes,
                            name: hasUser.name
                        })
                        return resolve(signature);
                    }
                }
                return reject({ error: 'LoginError', status: 401, message: 'Email or password wrong.' });
        });
    };

    restaurantProfile = (user?: AuthPayload): Promise<RestaurantDocument | null>  => {
        return this.findByUser(user);
    };

    updateRestaurantProfile = (user: AuthPayload | undefined, editRestaurant: EditRestaurantInput): Promise<DocumentDTO<RestaurantDocument> | null>  => {
        return this.findByIdAndUpdate(user?._id, editRestaurant);
    };

    updateRestaurantService = (user: AuthPayload | undefined): Promise<RestaurantDocument | null>  => {
        return this.findByUser(user)
            .then((restaurant) => {
                if(restaurant) {
                    restaurant.serviceAvailable = !restaurant.serviceAvailable;
                    return restaurant.save();
                }
                return null;
            });
    };

    addFoodRestaurant = (user: AuthPayload | undefined, foodInputs: CreateFoodInputs): Promise<RestaurantDocument | null>  => {
        return this.findByUser(user)
            .then(async (restaurant) => {
                if(restaurant) {
                    const food = await FoodService.createFood(restaurant._id, foodInputs);
                    restaurant.foods.push(food);
                    return restaurant.save();
                }
                return null;
            });
    };

    getAvailableFoods = (id?: string): Promise<DocumentDTO<RestaurantDocument>> => {
        return RestaurantService.findOne(
            { _id: id, serviceAvailable: true },
            'foods'
        )
    };

    getTopRestaturants = (id?: string, limit: number = 0): Promise<DocumentDTO<RestaurantDocument>> => {
        const query = !!id ? { _id: id } : {};
        return RestaurantService.find(
            { ...query, serviceAvailable: true },
            { rating: "descending" },
            limit,
            'foods'
        )
    };

    getFoodAvaiableByReadyTime = (id: string, readTime: number = 0) => {
        return RestaurantService.find(
            { _id: id, serviceAvailable: true },
            { rating: "descending" },
            null,
            'foods'
        ).then(restaurants => {
            return restaurants.reduce((acc: [FoodDocument], restaurant: RestaurantDocument) => {
                const foods = restaurant.foods;
                const filteredFoods = foods.filter((food: FoodDocument) => food.readyTime <= readTime) as [FoodDocument];
                return [ ...acc, ...filteredFoods ];
            }, []);
        });
    }

    getFoods = (id: string, foodsSearch?: string[]) => {
        return RestaurantService.find(
            { _id: id, serviceAvailable: true },
            { rating: "descending" },
            null,
            'foods'
        ).then(restaurants => {
            return restaurants.reduce((acc: [FoodDocument], restaurant: RestaurantDocument) => {
                const foods = !!foodsSearch && foodsSearch.length > 0 ?
                                            restaurant.foods.filter((food: FoodDocument) => checkInArrayIfHasString(food.name, foodsSearch)) as [FoodDocument] :
                                            restaurant.foods;
                return [ ...acc, ...foods ];
            }, []);
        });
    }

    getRestaurantById = (id: string) => {
        return this.findById(id, 'foods');
    };

    getOrders = (user: AuthPayload | undefined): Promise<RestaurantDocument | null>  => {
        return promiseWrap(async (resolve, reject) => {
            const result = await OrderService.find(
                { restaurantId: user?._id },
                { orderDate: "descending" },
                null,
                'items.food'
            )
            if (result) {
                return resolve(result);
            }
            return reject({ error: 'GetError', status: 401, message: 'Not Found.' });
        });
    }
}

const RestaurantService = new RestaurantServiceClass();

export default RestaurantService;
