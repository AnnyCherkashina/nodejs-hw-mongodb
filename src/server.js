
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(pino());
app.use(express.json());
app.use(cookieParser());


const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/swagger.json'))); // <-- Використовуємо fs.readFileSync


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);


app.use(notFoundHandler);
app.use(errorHandler);

export default app;