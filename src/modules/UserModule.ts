import CosmosModule from './CosmosModule';
import {parsePostUser, parsePutUser} from '../parser';
import {Status, User} from '../interfaces';

export default class Users {
    cosmosModule = new CosmosModule();

    /**
     * Parse and post the object
     * @param {User} user User object
     * @return {success} Returns status
     */
    async postUsers(user: User): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        // Parse user in to correct interface
        // and check if user already exists
        const parsedUser = await parsePostUser(user);
        const existingUser = await this.cosmosModule.checkUser(parsedUser.userName);

        // If user exists, return false
        // else post user to database
        if (existingUser) {
          return {
            status: 409,
            body: 'User already exists!',
          } as Status;
        } else {
          // Insert user using cosmosModule insertUser function
          const insertResult = await this.cosmosModule.insertUser(parsedUser);

          // If insert was succesful
          // inserResult is true
          if (insertResult) {
            return {
              status: 201,
              body: 'User upsert!',
            } as Status;
          }

          // Throw error incase of failure
          throw new Error('Upsert failed!');
        }
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }

    /**
     * Parses and upserts User object
     * @param {User} user User object
     * @return {success} Returns status
     */
    async putUsers(user: User): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        // Parse user in to correct interface
        // and check if user already exists
        const parsedUser = await parsePutUser(user);
        const existingUser = await this.cosmosModule.checkUser(parsedUser.userName, parsedUser.passwordHash);

        // If user exists, upsert user
        // else return 404
        if (existingUser) {
          // Update user information
          const upsertResult = await this.cosmosModule.upsertUser(parsedUser);

          // If upsert was succesful
          // upsertResult is true
          if (upsertResult) {
            return {
              status: 201,
              body: 'User upsert!',
            } as Status;
          }

          // Throw error incase of failure
          throw new Error('Upsert failed!');
        } else {
          return {
            status: 404,
            body: 'User not found!',
          } as Status;
        }
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }

    /**
     * Check if user exists and return boolean
     * @param {string} userName userName for validation
     * @param {string} password password for hash and for validation
     * @return {boolean} True if exists, false if not
     */
    async getUsers(userName: string, password: string): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        // Fetch user if exists
        const result = await this.cosmosModule.findUser(userName, password);

        // Check if user is found
        // else return error 404 not found
        if (result) {
          return {
            status: 200,
            body: result,
          } as Status;
        }

        return {
          status: 404,
          body: 'User not found!',
        } as Status;
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }
}
