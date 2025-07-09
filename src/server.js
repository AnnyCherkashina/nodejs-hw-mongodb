import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(pino());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);

// Base route (для перевірки, що API працює)
app.get('/', (req, res) => {
    res.json({ message: 'API is running. Welcome to HW6!' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
