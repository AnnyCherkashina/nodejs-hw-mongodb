import express from 'express';
import {
    getAllContactsController,
    getContactByIdController,
    createContactController,
    updateContactController,
    deleteContactController
} from '../controllers/contacts.js';

import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';


const router = express.Router();

router.use(authenticate);

router.get('/', getAllContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', validateBody(createContactSchema), createContactController);

router.patch('/:contactId', isValidId, validateBody(updateContactSchema), updateContactController);

router.delete('/:contactId', isValidId, deleteContactController);

export default router;
