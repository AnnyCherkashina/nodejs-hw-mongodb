import * as fs from 'node:fs/promises';
import path from 'node:path';

import createHttpError from 'http-errors';

import {
    createContact as createContactService, // Імпортуємо функції сервісу з аліасами
    getAllContacts as getAllContactsService,
    getContactById as getContactByIdService,
    updateContact as updateContactService,
    deleteContact as deleteContactService,
} from '../services/contacts.js'; // Виправлено: правильний шлях до файлу сервісу
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { UPLOAD_DIR } from '../constants/index.js';

export const getAllContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;
    const response = await getAllContactsService({ // Виправлено: використовуємо getAllContactsService
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: response,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    const contact = await getContactByIdService(id, userId); // Виправлено: використовуємо getContactByIdService
    if (!contact) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    let photo = null;

    if (req.file) {
        if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
            const result = await uploadToCloudinary(req.file.path);
            photo = result.secure_url;
        } else {
            await fs.rename(
                req.file.path,
                path.join(UPLOAD_DIR, req.file.filename),
            );
            photo = `${getEnvVar('APP_DOMAIN')}/uploads/${req.file.filename}`;
        }
    }

    const contact = { ...req.body, userId: req.user._id, photo };
    const result = await createContactService(contact); // Виправлено: використовуємо createContactService

    res.status(201).send({
        status: 201,
        message: 'Successfully created a contact!',
        data: result,
    });
};

export const updateContactController = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const userId = req.user._id;

    let photo;
    if (req.file) {
        if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
            const result = await uploadToCloudinary(req.file.path);
            photo = result.secure_url;
        } else {
            await fs.rename(
                req.file.path,
                path.join(UPLOAD_DIR, req.file.filename),
            );
            photo = `${getEnvVar('APP_DOMAIN')}/uploads/${req.file.filename}`;
        }
    }

    const result = await updateContactService(id, userId, { ...body, photo }); // Виправлено: використовуємо updateContactService

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(200).send({
        status: 200,
        message: 'Successfully patched a contact!',
        data: result,
    });
};

export const deleteContactController = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await deleteContactService(id, userId); // Виправлено: використовуємо deleteContactService

    if (!result) {
        throw new createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
};
