// 1. to create a transaction
// 2. to list all the cart items and proceed if cart is not empty
// 3. calculate the total amount
// 4. fetch address of user
// 5. to define computed field for formatted address on address module
// 6. we will create a order and order productsorder products
// 7. create event

import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { prismaClient } from "../index.ts";
import { NotFoundException } from "../exception/not-found.ts";
import { ErrorCode } from "../exception/root.ts";
import { BadRequestException } from "../exception/bad-request.ts";

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cart.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                products: true
            }
        })

        if (cartItems.length === 0) {
            return res.json({ message: "Cart is empty." })
        }

        const MRP = cartItems.reduce((acc, curr) => {
            return acc + (+curr.products.price * curr.quantity)
        }, 0)

        const totalAmount = MRP > 500 ? MRP : MRP + 50
        
        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddress
            }
        })

        if (!address) {
            throw new NotFoundException(
                "Default shipping address not set or not found",
                ErrorCode.ADDRESS_NOT_FOUND
            );
        }
        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: totalAmount,
                address: address?.formattedAddress,
                orderProduct: {
                    create: cartItems.map(cart => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })
        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })
        await tx.cart.deleteMany({
            where: {
                userId: req.user.id
            }
        })
        return res.json({ order, orderEvent })
    })
} 


export const listOrders = async(req: AuthenticatedRequest, res: Response) =>{
   
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user.id
        },
        include: {
                orderProduct: true,
                orderEvent: true
            }
    })
    res.json(orders?orders:"NO orders")
}

export const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  const orderId = Number(req.params.id);
  const userId = req.user.id;

  const updatedOrder = await prismaClient.$transaction(async (tx) => {
    
    const existingOrder = await tx.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException("Order not found or access denied", ErrorCode.ORDER_NOT_FOUND);
    }

    if (existingOrder.status === "CANCELLED") {
      throw new BadRequestException("Order is already cancelled", ErrorCode.ORDER_ALREADY_CANCELLED);
    }

    const order = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });

    return order;
  });
  return res.json(updatedOrder);
};

export const getOrderById = async(req:AuthenticatedRequest, res: Response)=> {
    try{
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id)
            },
            include: {
                orderProduct: true,
                orderEvent: true
            }
        })

    res.json(order)
    }catch(err:any){
        throw new NotFoundException("No order of this id", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrdersByStatus = async(req:AuthenticatedRequest, res: Response)=>{
    let whereClause = {}
    const status = req.params.status
    if(status){
        whereClause = {
            status
        }
    }
    try{
        const orders = await prismaClient.order.findMany({
            where: whereClause,
            skip : Number(req.query.skip) || 0,
            take: 5
        })
    }catch(err:any){
        throw new NotFoundException(`No orders found by status: ${status}`, ErrorCode.ORDER_NOT_FOUND);
    }
}

export const changeStatus = async(req: AuthenticatedRequest, res: Response)=> {
    return await prismaClient.$transaction(async(tx)=>{
         try{
        const order = await tx.order.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                status: req.body.status
            }
        })

        await tx.orderEvent.create({
            data: {
                orderId: Number(req.params.id),
                status: req.body.status
            }
        })

        res.json(order)
   
    }catch(err:any){
        throw new NotFoundException("No order of this id", ErrorCode.ORDER_NOT_FOUND)
    }
    })
    
}

export const listUserOrders = async(req: AuthenticatedRequest, res: Response)=> {
    let whereClause: any = {userId: Number(req.params.id)}
    const status = req.params.status
    if(status){
        whereClause = {
            ...whereClause,
            status
        }
    }
    try{
        const orders = await prismaClient.order.findMany({
            where: whereClause,
            skip : Number(req.query.skip) || 0,
            take: 5
        })
    }catch(err:any){
        throw new NotFoundException('No orders found by userId', ErrorCode.ORDER_NOT_FOUND);
    }
}