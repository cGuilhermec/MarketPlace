import { Request, Response } from "express";
import { prisma } from "../database/prisma";


export const createProduct = async (req: Request, res: Response) => {

    const { name, price, amout } = req.body;
    const { storeId } = req.params;

    const isStore = await prisma.store.findUnique({
        where: {
            id: storeId
        }
    });

    const isProduct = await prisma.store.findFirst({
        where: {
            name: name
        }
    });

    if (!isStore){
        res.json({ Message: "The Store does not exist" });
     } else if (isProduct){
        res.json({ Message: `The Product ${name} already exist` });
     }

    const product = await prisma.product.create({

        data: { name, price, amout, Store: {
            connect: {
                id: storeId
            }
        }}, 

    });

    return res.json(product);

};

export const findManyProduct = async (req: Request, res: Response) => {

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            amout: true
        }
    });

    return res.json({ products });

};

export const deleteProduct = async (req: Request, res: Response) => {

    const { id } = req.params;

    const product = await prisma.product.delete({
        where: {
            id
        }
    });

    return res.json({ Message: `The product ${id} is delected` });

};