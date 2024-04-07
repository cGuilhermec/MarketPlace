import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const createSale = async (req: Request, res: Response) => {

    const { products, userSallerId } = req.body;
    const { id } =  req.user;
    
    try {
        
        const productsByDatabase = await prisma.product.findMany({
            where: {
                id: {in: products.map((product: any) => product.id)},
            },
        });

        const productWhithQauntity = productsByDatabase.map((product) => {
            const { id, name, price } = product;
            const quantity = products.find((p:any) => p.id === product.id).quantity;
            return {
                id,
                name,
                price,
                quantity,
            };
        });

        let total = 0;
        for( const product of productWhithQauntity ) {
            total += product.price * parseInt(product.quantity);
        }

        //criando uma venda
        const sale = prisma.sale.create({
            data: {
                total_value: total,
                Saller: { connect: { id: userSallerId } },
                Buyer: { connect: {id} },
                SaleProduct:{
                    create: productWhithQauntity.map((product) => ({
                        Product: { connect: { id: product.id } },
                        quantity: product.quantity,
                    })),
                },
            },
            include: {
                SaleProduct: true,
            }
        });

        return res.status(201).json({sale, message: "Compra realizada com sucesso!"})

    } catch (error) {
        
    }

};