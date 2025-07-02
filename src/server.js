// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';


const setupServer = () => { // <--- ВИДАЛІТЬ 'export' ТУТ
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());
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

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;

        const contact = await getContactById(contactId);

        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: `Contact with id ${contactId} not found`,
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully found contact!',
            data: contact,
        });
    });


    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}; // <--- ЗАЛИШТЕ ЦЕЙ РЯДОК БЕЗ ЗМІН

export default setupServer; // <--- ДОДАЙТЕ ЦЕЙ РЯДОК В КІНЦІ ФАЙЛУ