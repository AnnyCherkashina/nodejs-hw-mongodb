
import {
    getPaginatedContacts,
    getContactById as getContactByIdService,
    createContact as createContactService,
    updateContact as updateContactService,
    deleteContact as deleteContactService
} from '../services/contacts.js';
import createError from 'http-errors';

export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    const deleted = await deleteContactService(contactId, userId);

    if (!deleted) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};

export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    const updatedContact = await updateContactService(contactId, updateData, userId);

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
    const userId = req.user._id;

    const options = {
        page: parseInt(page),
        perPage: parseInt(perPage),
        sortBy,
        sortOrder,
        type,
        isFavourite,
        userId,
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
    const userId = req.user._id;

    const contact = await getContactByIdService(contactId, userId);

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
    const userId = req.user._id;

    const newContact = await createContactService({
        name,
        phoneNumber,
        email,
        isFavourite,
        contactType,
        userId,
    });

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
};