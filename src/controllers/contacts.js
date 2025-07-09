import * as contactsService from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
    const userId = req.user._id;
    const contacts = await contactsService.listContacts({ userId, ...req.query });
    res.json(contacts);
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await contactsService.getContactById(contactId, userId);
    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
};

export const createContactController = async (req, res) => {
    const userId = req.user._id;
    const contactData = { ...req.body, userId };
    const newContact = await contactsService.createContact(contactData);
    res.status(201).json(newContact);
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updatedContact = await contactsService.updateContact(contactId, userId, req.body);
    if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found or no updates provided' });
    }
    res.json(updatedContact);
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const deleted = await contactsService.deleteContact(contactId, userId);
    if (!deleted) {
        return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
};
