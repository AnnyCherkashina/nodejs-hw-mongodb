import * as contactsService from "../services/contacts.service.js";
import createError from "http-errors";

export const getAllContacts = async (req, res) => {
    const {
        page = 1,
        perPage = 10,
        sortBy = 'name',
        sortOrder = 'asc',
        type,
        isFavourite
    } = req.query;

    const result = await contactsService.listContacts({
        userId: req.user._id, // Додаємо userId для фільтрації
        page: Number(page),
        perPage: Number(perPage),
        sortBy,
        sortOrder,
        type,
        isFavourite
    });

    res.status(200).json({
        status: 200,
        message: "Contacts retrieved successfully",
        data: result
    });
};

export const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId, req.user._id);
    if (!contact) throw createError(404, "Contact not found");

    res.status(200).json({
        status: 200,
        message: "Contact retrieved successfully",
        data: contact
    });
};

export const createContact = async (req, res) => {
    const contactData = {
        ...req.body,
        userId: req.user._id // Додаємо userId до даних контакту
    };
    const newContact = await contactsService.createContact(contactData);

    res.status(201).json({
        status: 201,
        message: "Contact created successfully",
        data: newContact
    });
};

export const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const updatedContact = await contactsService.updateContact(contactId, req.user._id, req.body);
    if (!updatedContact) throw createError(404, "Contact not found");

    res.status(200).json({
        status: 200,
        message: "Contact updated successfully",
        data: updatedContact
    });
};

export const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const isDeleted = await contactsService.deleteContact(contactId, req.user._id);
    if (!isDeleted) throw createError(404, "Contact not found");

    res.status(200).json({
        status: 200,
        message: "Contact deleted successfully"
    });
};