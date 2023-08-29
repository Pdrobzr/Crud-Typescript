import { compare, hash } from "bcryptjs";
import { prisma } from "../utils/prisma";
import { Request, Response } from 'express';
import { sign } from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

export class UserController {

    async listarUsuarios(req: Request, res: Response) {
        const users = await prisma.user.findMany();

        return res.json({ users });
    }

    async criarUsuario(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userExists) {
            return res.status(400).json({ error: 'Erro! Usuário já cadastrado!' });
        }

        const hashPassword = await hash(password, 8);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            },
        });

        return res.json({ message: 'Usuario criado com sucesso!', user });
    }

    async autenticarUsuario(req: Request, res: Response) {
        const { email, password } = req.body;
        const secret = process.env.SECRET;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Erro ao realizar o login!' });
        }

        const isValuePassword = await compare(password, user.password);

        if (isValuePassword === false) {
            return res.status(400).json({ error: 'Erro ao realizar o login!' });
        }

        const token = sign({ id: user.id }, secret as string, { expiresIn: "1d" });

        const { id } = user;

        return res.json({ message: 'Usuário logado com sucesso!', user: { id, email }, token });
    }

    async atualizarUsuario(req: Request, res: Response) {
        const { id } = req.params;
        const idInt = Number(id);
        const { name, email } = req.body;

        const userExists = await prisma.user.findUnique({
            where: {
                id: idInt
            }
        })

        if (!userExists) {
            return res.status(401).json({ error: 'Erro ao atualizar usuário!' });
        } else {

            const updateUser = await prisma.user.update({
                data: {
                    name,
                    email
                },
                where: {
                    id: idInt
                },
            });

            return res.json({message: 'Usuário atualizado com sucesso!', updateUser });
        }
    }

    async deletarUsuario(req: Request, res: Response) {
        const { id } = req.params;
        const idInt = Number(id);

        const userExists = await prisma.user.findUnique({
            where: {
                id: idInt
            }
        })

        if (!userExists) {
            res.status(401).json({ error: 'Erro ao excluir o usuário' });
        } else {

            const deleteUser = await prisma.user.delete({
                where: {
                    id: idInt
                }
            });

            return res.json({ message: 'Usuário deletado com sucesso!', deleteUser});
        }
    }

}