import { CustomerPayload } from "./Customer.dto";
import { RestaurantPayload } from "./Restaurant.dto";

export type AuthPayload = RestaurantPayload | CustomerPayload;
