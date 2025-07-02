import { readFile } from 'fs/promises';
import { PATH_DB } from '../constants/contacts.js';

const readContacts = async () => {
    const data = await readFile(PATH_DB, 'utf-8');
    return JSON.parse(data);
};

export default readContacts;