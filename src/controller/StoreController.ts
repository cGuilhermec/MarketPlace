import { Request, Response } from "express";
import { prisma } from "../database/prisma";


export const createSotre = async (req: Request, res: Response) => {

    const {name} = req.body;
    const { id } = req.user;

    const isUser = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if(!isUser) {
        return res.status(400).json({ Message: `User does not exist!` });
    };

    const store = await prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id
                }
            }
            
        }
    });

    return res.json({store})
};

export const findManyStore = async (req: Request, res: Response) => {

    const stores = await prisma.store.findMany({
        select: {
            id: true,
            name: true,
            User: {
                select: {
                    name: true
                }
            },
            product: {
                select: {
                    name: true,
                    id: true,
                    price: true,
                    amout: true
                }
            }
        }
    });

    return res.json(stores);

};