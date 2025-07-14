import express from 'express';
import * as contactsController from '../controllers/contacts.controller.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactSchemas.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(contactsController.getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactById));

router.post(
    '/',
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(contactsController.createContact)
);

router.patch(
    '/:contactId',
    isValidId,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(contactsController.updateContact)
);

router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));

export default router;