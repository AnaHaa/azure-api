import bcrypt from 'bcryptjs';
import config from '../../azure-config.json';
import {User, Visit} from '../interfaces';
import mongoose, {Connection} from 'mongoose';
import {userDocument, visitDocument, userSchema, visitSchema} from '../models';

export default class CosmosModule {
    User = mongoose.model('User', userSchema);
    Visit = mongoose.model('Visit', visitSchema);
    db: string = 'Main';
    connection: Connection;
    uri: string;

    constructor() {
      this.uri = config.CosmosConnectionString;
    }

    // Setup the connection to CosmosDB
    async setConnection(): Promise<void> {
      await mongoose.connect(this.uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: this.db,
      });

      this.connection = mongoose.connection;
    }

    /**
     * Insert new User object
     * @param {User} user object
     * @return {success} Returns boolean
     */
    async insertUser(user: User): Promise<boolean> {
      const users = mongoose.model<userDocument>('Users', userSchema, 'Users');
      const results = await users.create(user);

      // Check mongoose return object
      // If acknowledged return true
      if (results) {
        return true;
      }

      return false;
    }

    /**
     * Upserts User object
     * @param {User} user
     * @return {success} Returns boolean
     */
    async upsertUser(user: User): Promise<boolean> {
      const users = mongoose.model<userDocument>('Users', userSchema, 'Users');
      // Update existing user
      const results = await users.updateOne(
          {
            'userName': user.userName,
          },
          {$set: {
            'name': user.name || '',
            'country': user.country || '',
            'profilePic': user.profilePic || '',
          }},
          {upsert: true},
      );

      // Check mongoose return object
      // If ok return true
      if (results.ok === 1) {
        return true;
      }

      return false;
    }

    /**
     * Check if user exists and return user object
     * @param {string} userName userName for validation
     * @param {string} password password for validation
     * @return {User} User object
     */
    async findUser(userName: string, password: string): Promise<User> {
      const users = mongoose.model<userDocument>('Users', userSchema, 'Users');
      const results = await users.find({
        'userName': userName,
      });

      // Get the first element of the array if it is array
      const result = Array.isArray(results) ? results[0] : results;

      if (result) {
        // Check if password is matching with the stored password
        const validPassword = await bcrypt.compare(password, result.passwordHash);

        // Return only essential user information
        if (validPassword) {
          return {
            _id: result._id,
            name: result.name,
            country: result.country,
            profilePic: result.profilePic,
            userName: result.userName,
          } as User;
        }
      }

      return null;
    }

    /**
     * Check if user exists and return boolean
     * @param {string} userName userName for validation
     * @param {string} passwordHash passwordHash for validation (optional)
     * @return {success} Returns boolean
     */
    async checkUser(userName: string, passwordHash?: string): Promise<boolean> {
      const users = mongoose.model<userDocument>('Users', userSchema, 'Users');
      const results = await users.find({
        'userName': userName,
      });

      // Get the first element of the array if it is array
      const result = Array.isArray(results) ? results[0] : results;

      if (passwordHash) {
        // Check if user exists
        if (result) {
          const validPassword = await bcrypt.compare(passwordHash, results[0].passwordHash);

          // Return true if password is correct
          if (validPassword) {
            return true;
          } else {
            return false;
          }
        }

        return false;
      } else {
        // If user exists return true
        if (result) {
          return true;
        }

        return false;
      }
    }

    /**
     * Upserts the Visit object
     * @param {Visit} visit object
     * @return {success} Returns boolean
     */
    async upsertVisit(visit: Visit): Promise<boolean> {
      const visits = mongoose.model<visitDocument>('Visits', visitSchema, 'Visits');
      const results = await visits.replaceOne(
          {
            'UserId': visit.UserId,
            'name': visit.name,
          },
          visit,
          {upsert: true},
      );

      // Check mongoose return object
      // If ok return true
      if (results.ok === 1) {
        return true;
      }

      return false;
    }

    /**
     * Find visits by UserId
     * @param {string} UserId
     * @return {visitDocument[]}
     */
    async getVisits(UserId: string): Promise<Visit[]> {
      const visits = mongoose.model<visitDocument>('Visits', visitSchema, 'Visits');
      const results = await visits.find({
        'UserId': UserId,
      });

      return results;
    }

    /**
     * Delete visit by _id
     * @param {string} visitId
     * @return {visitDocument[]}
     */
    async deleteVisit(visitId: string): Promise<boolean> {
      const visits = mongoose.model<visitDocument>('Visits', visitSchema, 'Visits');
      const results = await visits.deleteOne({'_id': visitId});

      // Check mongoose return object
      // If deletedCount is above zero return true
      if (results && results.deletedCount > 0) {
        return true;
      }

      return false;
    }
}
