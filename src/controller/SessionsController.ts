import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

// Controlador para lidar com a autenticação de usuários
export const signIn = async (req: Request, res: Response) => {

    try {
        // Extrai o email e a senha do corpo da requisição
        const { email, password } = req.body;

        // Procura pelo usuário no banco de dados com base no email fornecido
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            // Inclui os acessos do usuário, permitindo selecionar os nomes dos acessos
            include: {
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

        // Retorna um erro 400 se o usuário não for encontrado
        if(!user) {
            return res.status(400).json({ Message: "User not found." });
        };

        // Compara a senha fornecida com a senha armazenada no banco de dados
        const isPasswordValid = await compare(password, user.password);

        // Retorna um erro 400 se a senha fornecida for incorreta
        if(!isPasswordValid) {
            return res.status(400).json({ Message: "Incorrect password." });
        }

        // Obtém a chave secreta do ambiente ou lança um erro se não estiver definida
        const MY_SECRET_KEY = process.env.MY_SECRET_KEY;

        if(!MY_SECRET_KEY) {
            throw new Error("The MY_SECRET_KEY was not provided!");
        };

        // Gera um token JWT contendo o ID do usuário e seus papéis de acesso
        const token = sign({
            userId: user.id, 
            roles: user.UserAccess.map(role => role.Access?.name)
        }, MY_SECRET_KEY, {
            algorithm: "HS256", // Algoritmo de hash a ser usado para assinar o token
            expiresIn: "1h",    // Tempo de expiração do token (1 hora)
        });

        // Retorna o token gerado como resposta bem-sucedida
        return res.status(200).json({token});

    } catch (error) {
        // Retorna um erro 400 se ocorrer algum erro durante o processo de autenticação
        return res.status(400).json(error);
    }

}
