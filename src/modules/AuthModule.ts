import config from '../../azure-config.json';
import {RequestHeader} from '../interfaces';

export default class AuthModule {
    apikey: string = config.ApiKey;

    /**
     * Check request apiKey
     * @param {header} header
     * @return {success} Returns authentication true or false
     */
    async authRequest(header: RequestHeader): Promise<boolean> {
      const requestApiKey: string = header.apikey;

      // Use ApiKey for authentication
      // return true if valid
      if (requestApiKey === this.apikey) {
        return true;
      }

      return false;
    }
}
