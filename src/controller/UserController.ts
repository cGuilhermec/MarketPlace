import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";


export const createUser = async (req: Request, res: Response) => {

    const { name, email, password, accessName } = req.body;

    const isUserUniqueEmail = await prisma.user.findUnique({
        where: {
            email
        },
    });

    const isAccessName = await prisma.access.findUnique({
        where: {
            name: accessName
        },
    });

    if(!isAccessName) {
        return res.status(400).json({ Message: "This access level does not exist" });
    };

    if(isUserUniqueEmail) {
        return res.status(400).json({ Message: "User exist" });
    };

    const hashPassword = await hash(password, 8);

    const user = await prisma.user.create({

        data: { name, email, password: hashPassword, Access: {
            connect: {
                name: accessName    
            },
        } },
        select: {
            id: true,
            name: true,
            email: true,
            Access: {
                select: {
                    name: true
                },
            },
        },
    });


    return res.json(user);
};

export const deleteUsers = async (req: Request, res: Response) => {

    await prisma.user.deleteMany();

    return res.json({ Menssage: "All Users deleted" });

};

export const deleteOneUser = async ( req: Request, res: Response ) => {

    const { id } = req.body;

    const user = await prisma.user.delete({
        where: {
            id
        },
    });

    return res.json({ Message: `User ${id} deleted whit success!` });

};

export const getAllUsers = async ( req: Request, res: Response )  => {

    const users = await prisma.user.findMany();

    return res.json(users);

};