import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js'; // Виправлено: шлях до schemas/contactSchemas.js
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Middleware для аутентифікації застосовується до всіх маршрутів контактів
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
    '/',
    upload.single('photo'), // Middleware для завантаження одного файлу з полем 'photo'
    validateBody(createContactSchema),
    ctrlWrapper(createContactController)
);

router.patch(
    '/:contactId',
    isValidId,
    upload.single('photo'), // Middleware для завантаження одного файлу з полем 'photo'
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
