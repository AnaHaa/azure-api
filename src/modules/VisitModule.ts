import CosmosModule from './CosmosModule';
import {parseVisit} from '../parser';
import {Status, Visit} from '../interfaces';

export default class Visits {
    cosmosModule = new CosmosModule();

    /**
     * Parse and upserts the object
     * @param {Visit} visit Visit object
     * @return {success} Returns mongoose success object
     */
    async putVisits(visit: Visit): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        // Parse visit to visit object
        // and upsert visit object
        const parsedVisit = parseVisit(visit);
        const putResult = await this.cosmosModule.upsertVisit(parsedVisit);

        // Check if upsert succeeded
        if (putResult) {
          return {
            status: 201,
            body: 'Visit upsert!',
          } as Status;
        }

        // Throw error incase of failure
        throw new Error('Upsert failed!');
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }

    /**
     * Delete visit object using _id
     * @param {visitId} visitId Visit _id
     * @return {success} Returns status
     */
    async deleteVisit(visitId: string): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        // delete visit using visit _id
        const deleteResult = await this.cosmosModule.deleteVisit(visitId);

        // Check if deletion succeeded
        if (deleteResult) {
          return {
            status: 202,
            body: 'Visit deleted!',
          } as Status;
        }

        // Throw error incase of failure
        throw new Error('Delete failed!');
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }

    /**
     * Get user visits
     * @param {string} UserId UserId for finding objects
     * @return {Visit} Visit object array
     */
    async getVisits(UserId: string): Promise<Status> {
      // Set up the connection to cosmos database
      await this.cosmosModule.setConnection();

      try {
        const visitArray = await this.cosmosModule.getVisits(UserId);
        const results: Visit[] = [];

        // Parse each object in to Visit object
        // and push in to result array
        visitArray.forEach((result) => {
          const parsedResult = parseVisit(result as Visit);
          results.push(parsedResult);
        });

        // If there are visits
        // return 200 and visits
        if (results.length) {
          return {
            status: 200,
            body: results,
          } as Status;
        }

        // Return 404 if there were no visits
        return {
          status: 404,
          body: 'Visits not found!',
        } as Status;
      } catch (e) {
        // Forward error to HttpTrigger function
        throw new Error(e.message);
      }
    }
}
