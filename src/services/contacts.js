// src/services/contacts.js
import { Contact } from '../db/models/contact.js';

export const getPaginatedContacts = async ({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    userId,
}) => {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const filter = { userId };

    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    const totalItems = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(perPage);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
};

export const getContactById = async (contactId, userId) => {
    const contact = await Contact.findOne({ _id: contactId, userId });
    return contact;
};

export const createContact = async (contactData) => {
    const newContact = await Contact.create(contactData);
    return newContact;
};

export const updateContact = async (contactId, updateData, userId) => {
    const updated = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        updateData,
        { new: true },
    );
    return updated;
};

export const deleteContact = async (contactId, userId) => {
    const result = await Contact.findOneAndDelete({ _id: contactId, userId });
    return result;
};