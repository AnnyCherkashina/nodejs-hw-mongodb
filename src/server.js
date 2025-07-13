import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(pino());
app.use(express.json());
app.use(cookieParser());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;