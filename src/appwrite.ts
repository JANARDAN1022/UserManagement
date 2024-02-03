import { Client, Account,Storage,Databases} from 'appwrite';

export const client = new Client();
export const storage = new Storage(client);


client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('65bd1651666a04610f75'); // Replace with your project ID
export default client

export const account = new Account(client);
export const appwriteDB = new Databases(client);
export { ID } from 'appwrite';
