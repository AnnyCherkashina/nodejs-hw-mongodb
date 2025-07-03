import { getPaginatedContacts, getContactById as getContactByIdService, createContact as createContactService, updateContact as updateContactService, deleteContact as deleteContactService } from '../services/contacts.js';
import createError from 'http-errors';

export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;

    const deleted = await deleteContactService(contactId);

    if (!deleted) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};

export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await updateContactService(contactId, updateData);

    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

export const getAllContacts = async (req, res, next) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        type,
        isFavourite,
    } = req.query;

    const options = {
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortBy,
        sortOrder,
        type,
        isFavourite,
    };

    const result = await getPaginatedContacts(options);

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: result,
    });
};

export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: 'Successfully found contact!',
        data: contact,
    });
};

export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite = false, contactType } = req.body;

    // Видалено: Ручна валідація, оскільки її тепер обробляє Joi та validateBody middleware
    // if (!name || !phoneNumber || !contactType) {
    //     throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
    // }

    const newContact = await createContactService({ name, phoneNumber, email, isFavourite, contactType });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};
