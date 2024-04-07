import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { prisma } from "../database/prisma";

// import dotenv from 'dotenv';

// dotenv.config();

interface DecodedToken {
    userId: string;
}

// Função de middleware de autenticação que pode receber permissões opcionais
export function authMiddleware(permissions?: string[]) {
    // Retorna uma função assíncrona que será usada como middleware
    return async (req: Request, res: Response, next: NextFunction) => {

        // Verifica se o cabeçalho de autorização está presente e é válido
        const authHeader = req.headers.authorization;

        if( !authHeader|| !authHeader.startsWith("Bearer ") ) {
            return res.status(401).json({ Message: "The token was not provided!" })
        }

        // Extrai o token do cabeçalho
        const token = authHeader.substring(7);

        try {
            // Obtém a chave secreta do ambiente ou lança um erro se não estiver definida
            const MY_SECRET_KEY = process.env.MY_SECRET_KEY

            if( !MY_SECRET_KEY ) {
                throw new Error("The MY_SECRET_KEY was not provided!");
            }
            
            // Decodifica o token JWT usando a chave secreta
            const decodedToken = verify(token, MY_SECRET_KEY) as DecodedToken;

            // Adiciona o ID do usuário decodificado ao objeto de solicitação para uso posterior
            req.user = { id: decodedToken.userId };

            // Verifica se o middleware foi chamado com permissões específicas
            if(permissions) {
                // Procura pelo usuário no banco de dados com base no ID decodificado do token
                const user = await prisma.user.findUnique({
                    where: {
                        id: decodedToken.userId,
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
                
                // Extrai os nomes dos acessos do usuário ou define como um array vazio se o usuário não for encontrado
                const userPermissions = user?.UserAccess.map((na) => na.Access?.name) ?? [];
                
                // Verifica se o usuário possui pelo menos uma das permissões exigidas
                const hasPermission = permissions.some((p) => userPermissions.includes(p));

                // Retorna um erro 403 se o usuário não tiver as permissões necessárias
                if(!hasPermission) {
                    return res.status(403).json({ message: "Permission denied." });
                }
            };

            // Chama o próximo middleware se todas as verificações passarem
            return next();

        } catch (error) {
            // Retorna um erro 401 se o token for inválido ou expirar
            return res.status(401).json({ Messsage: "Token invalidated." });
        }

    }
};
