import { AuthPayload, CreateRestaurantInput, EditRestaurantInput, RestaurantLoginInput } from "../dto";
import { Restaurant, RestaurantDocument } from "../models";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { DocumentDTO } from "../dto/Common.dto";
import { CreateFoodInputs } from "../dto/Food.dto";
import { BaseDbService } from "./CommonDbService";
import FoodService from "./FoodServices";
import { FoodDocument } from "../models/Food";
import { checkInArrayIfHasString } from "../utility/CommonUtility";

class RestaurantServiceClass extends BaseDbService<RestaurantDocument>{
    constructor() {
        super(Restaurant);
    }
        
    createRestaurantService = (restaurant: CreateRestaurantInput): Promise<DocumentDTO<RestaurantDocument>>  => {
        return new Promise((resolve, reject) => {
            (async () => { 
                const hasRestaurant = await this.findByEmail(restaurant.email);
                if(hasRestaurant !== null) {
                    return reject("This email is already in use.");
                }
                const salt = await GenerateSalt();
                const password = await GeneratePassword(restaurant.password, salt);
                const createRestaurant = await this.dbModel.create({ foods: [], ...restaurant, salt, password });
                return resolve(createRestaurant);
            })()
        });
    };

    restaurantLogin = (restaurant: RestaurantLoginInput): Promise<string>  => {
        const { email, password } = restaurant;
        return new Promise((resolve, reject) => {
            (async () => {
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
                return reject("The email or password is wrong.");
            })()
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

    getAvailableFoods = (pinCode?: string): Promise<DocumentDTO<RestaurantDocument>> => {
        return RestaurantService.find(
            { pinCode, serviceAvailable: true },
            { rating: "descending" },
            null,
            'foods'
        )
    };

    getTopRestaturants = (pinCode?: string, limit: number = 0): Promise<DocumentDTO<RestaurantDocument>> => {
        const query = !!pinCode ? { pinCode: pinCode } : {};
        return RestaurantService.find(
            { ...query, serviceAvailable: true },
            { rating: "descending" },
            limit,
            'foods'
        )
    };

    getFoodAvaiableByReadyTime = (pinCode: string, readTime: number = 0) => {
        return RestaurantService.find(
            { pinCode, serviceAvailable: true },
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

    getFoods = (pinCode: string, foodsSearch?: string[]) => {
        return RestaurantService.find(
            { pinCode, serviceAvailable: true },
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
}

const RestaurantService = new RestaurantServiceClass();

export default RestaurantService;
