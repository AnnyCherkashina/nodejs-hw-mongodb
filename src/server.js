
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

export const startServer = () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());
    app.use(cors({
        origin: ['http://localhost:3000', 'https://nodejs-hw-mongodb-tm8n.onrender.com'],
        credentials: true,
    }));
    app.use(cookieParser());

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        })
    );

    app.get('/', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    app.use('/contacts', contactsRouter);
    app.use('/auth', authRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};