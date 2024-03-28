import { NextFunction, Request, Response } from "express";
import { responseHandle } from "../utility/CommonUtility";
import OrderService from "../services/OrderServices";
import { OrderInputs } from "../dto/Order.dto";

export const CreateOrder = (req: Request, res: Response, next: NextFunction) => {
    const orderInputs = <[OrderInputs]>req.body;
    responseHandle(res, OrderService.createOrder(req.user, orderInputs));
};

export const GetOrders = (req: Request, res: Response, next: NextFunction) => {
    responseHandle(res, OrderService.getOrders());
};

export const GetOrderById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.id;
    responseHandle(res, OrderService.getOrderById(id));
};

export const GetOrderByOrderId = (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params?.orderId;
    responseHandle(res, OrderService.getOrderByOrderId(orderId));
};
