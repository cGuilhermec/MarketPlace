import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { hash } from "bcryptjs";


export const createUser = async (req: Request, res: Response) => {

    try {
        
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
            return res.status(400).json({ Message: `User ${isUserUniqueEmail.email} exist` });
        };

        const hashPassword = await hash(password, 8);

        const user = await prisma.user.create({

            data: { name, email, password: hashPassword, UserAccess: {
                create: {
                    Access: {
                        connect: {
                            name: accessName,
                        }
                    }
                }
            }},
            select: {
                id: true,
                name: true,
                email: true,
                UserAccess: {
                    select: {
                        Access: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            },
        });


        return res.status(201).json(user);

    } catch (error) {
        res.status(400).json(error);
    }

};

export const deleteUsers = async (req: Request, res: Response) => {

    try {
        
        await prisma.user.deleteMany();

        return res.status(200).json({ Menssage: "All Users deleted" });

    } catch (error) {
        return res.status(400).json(error);
    };

};

export const deleteOneUser = async ( req: Request, res: Response ) => {

    try {
        
        const { id } = req.body;

        const names = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });

        const user = await prisma.user.delete({
            where: {
                id
            },
        });

        return res.status(200).json({ Message: `User ${names?.name} deleted whit success!` });


    } catch (error) {
        return res.status(400).json(error);
    };

};

export const getAllUsers = async ( req: Request, res: Response )  => {

    try {
        
        const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            Store: {
                select: {
                    id: true,
                    name: true
                }
            },
            UserAccess: {
                select: {
                    Access: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    return res.status(200).json(users);

    } catch (error) {
        return res.status(400).json(error);
    };

};

export const getUniqueUser = async ( req: Request, res: Response ) => {

    try {
        
        const { id } = req.user;

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                UserAccess: {
                    select: {
                        Access: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if(!user) {
            return res.status(204).json({ Message: "User does not create or dont exist." });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json(error);
    }

}