import mongoose from 'mongoose';
import Contact from '../models/contact.model.js';

export const listContacts = async ({
    userId,
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
}) => {
    const filter = { userId };
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) {
        filter.isFavourite = isFavourite === 'true';
    }

    const skip = (page - 1) * perPage;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / perPage);

    const contacts = await Contact.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(perPage);

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
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return null;
    }
    return await Contact.findOne({ _id: contactId, userId });
};

export const deleteContact = async (contactId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return false;
    }
    const result = await Contact.findOneAndDelete({ _id: contactId, userId });
    return result !== null;
};

export const createContact = async (contactData) => {
    const newContact = await Contact.create(contactData);
    return newContact;
};

export const updateContact = async (contactId, userId, contactData) => {
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return null;
    }

    const cleanedData = Object.fromEntries(
        Object.entries(contactData).filter(([_, value]) => value !== undefined)
    );
    const updatedContact = await Contact.findOneAndUpdate(
        { _id: contactId, userId },
        cleanedData,
        { new: true, runValidators: true }
    );
    return updatedContact;
};