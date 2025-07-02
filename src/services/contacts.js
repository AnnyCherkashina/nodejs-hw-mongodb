import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    console.log('Loaded contacts:', contacts);
    return contacts;
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