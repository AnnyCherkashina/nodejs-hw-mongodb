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