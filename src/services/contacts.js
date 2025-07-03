import { Contact } from '../db/models/contact.js';

export const getPaginatedContacts = async ({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
}) => {
    const skip = (page - 1) * perPage;
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const filter = {};

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

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};

export const createContact = async (contactData) => {
    const newContact = await Contact.create(contactData);
    return newContact;
};

export const updateContact = async (contactId, updateData) => {
    const updated = await Contact.findByIdAndUpdate(contactId, updateData, {
        new: true,
    });
    return updated;
};

export const deleteContact = async (contactId) => {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
};