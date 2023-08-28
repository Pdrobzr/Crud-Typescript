import express from 'express';
import { router } from './routes';
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}!`));