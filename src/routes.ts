import {Router} from 'express';
import { UserController } from './controllers/UserController';
import { PostController } from './controllers/PostController';
import { AuthMiddleware } from './middlewares/auth';

export const router = Router();

const userController = new UserController();
const postController = new PostController();

router.post("/create", userController.criarUsuario);

router.get("/users", AuthMiddleware, userController.listarUsuarios);

router.post("/login", userController.autenticarUsuario);

router.put("/usuario/:id", userController.atualizarUsuario);

router.delete("/usuario/:id", userController.deletarUsuario);

router.get('/posts', AuthMiddleware, postController.listarPostagens);

router.post('/post/:id', AuthMiddleware, postController.criarPostagem);

router.put('/post/:id', AuthMiddleware, postController.atualizarPostagem);

router.delete('/post/:id', AuthMiddleware, postController.deletarPostagem);
