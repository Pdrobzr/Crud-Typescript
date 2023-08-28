import {Router} from 'express';
import { UserController } from './controllers/UserController';
import { AuthMiddleware } from './middlewares/auth';

export const router = Router();

const userController = new UserController();

router.post("/create", userController.criarUsuario);

router.get("/users", AuthMiddleware, userController.listarUsuarios);

router.post("/login", userController.autenticarUsuario);

router.put("/usuario/:id", userController.atualizarUsuario);

router.delete("/usuario/:id", userController.deletarUsuario);