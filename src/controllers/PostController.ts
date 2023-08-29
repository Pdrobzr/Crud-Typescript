import { prisma } from "../utils/prisma";
import { Response, Request } from "express";

export class PostController {

    async listarPostagens(req: Request, res: Response) {
        try {

            const posts = await prisma.post.findMany();

            return res.json({ posts });
        } catch (error) {

            return res.status(400).json({ error });

        } finally {

            await prisma.$disconnect();
        }

    }

    async criarPostagem(req: Request, res: Response) {
        const { id } = req.params;
        const idInt = Number(id);

        const { title, content } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id: idInt
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Erro! Id do usuário inválido!' });
        } else {
            const newPost = await prisma.post.create({
                data: {
                    title: title,
                    content: content,
                    userId: user.id
                }
            })

            return res.json({ message: 'Post criado com sucesso!', newPost });
        }


    }

    async atualizarPostagem(req: Request, res: Response) {
        const { id } = req.params;
        const idPost = Number(id);
        const {title, content} = req.body;

        const updatePost = await prisma.post.update({
            data: {
                title: title,
                content: content,
            },
            where: {
                id: idPost,
            },
        });

        res.json({message: 'Post atualizado com sucesso!', updatePost});
    }

    async deletarPostagem(req: Request, res: Response) {
        const idPost = Number(req.params.id);

        const deletePost = await prisma.post.delete({
            where: {
                id: idPost
            }
        });

        res.json({message: 'Post deletado com sucesso!', deletePost});
    }

}