import { Request, Response } from "express";
import { prisma } from "../database/prisma";


export const createSotre = async (req: Request, res: Response) => {

    const {name} = req.body;
    const {userId} = req.params;

    const isUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if(!isUser) {
        return res.status(400).json({ Message: "User does not exist!" });
    } else if (isUser) {
        return res.status(409).json({ Message: "There is already a store for this user" });
    };

    const store = await prisma.store.create({
        data: {
            name,
            User: {
                connect: {
                    id: userId
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