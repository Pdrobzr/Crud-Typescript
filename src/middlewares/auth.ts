import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';
import { verify } from "jsonwebtoken";
dotenv.config();

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

const secret = process.env.SECRET;

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido!' });
    }

    const [, token] = authorization.split(" ");

    try {
        const decoded = verify(token, secret as string);
        const { id } = decoded as TokenPayload;

        req.userId = id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalido!' });
    }
}