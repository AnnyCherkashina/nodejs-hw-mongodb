import { writeFile } from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';

const writeContacts = async (contacts) => {
    await writeFile(PATH_DB, JSON.stringify(contacts, null, 2));
};

export default writeContacts;