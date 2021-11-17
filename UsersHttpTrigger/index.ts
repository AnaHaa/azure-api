import {AzureFunction, Context, HttpRequest} from '@azure/functions';
import AuthModule from '../src/modules/AuthModule';
import Users from '../src/modules/UserModule';

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const auth = new AuthModule();
  const users = new Users();

  // Check if the request is valid
  const validRequest = await auth.authRequest(req.headers);

  // If request is valid
  // proceed with logic
  if (validRequest) {
    // Check request method
    try {
      if (req.method === 'GET') {
        if (req.query.userName && req.query.passwordHash) {
          // get User object without password
          const responseMessage = await users.getUsers(req.query.userName, req.query.passwordHash);

          context.res = {
            ...responseMessage,
          };
        } else {
          context.res = {
            status: 400,
            body: 'No userName / passwordHash in query!',
          };
        }
      } else if (req.method === 'POST') {
        // Insert new User object in to database
        const responseMessage = await users.postUsers(req.body);

        context.res = {
          ...responseMessage,
        };
      } else if (req.method === 'PUT') {
        // Update existing user name, country or profilePic
        const responseMessage = await users.putUsers(req.body);

        context.res = {
          ...responseMessage,
        };
      }
    } catch (e) {
      // In case of an error
      // return 400 status code
      // along with error code
      context.res = {
        status: 400,
        body: e.message,
      };
    }
  } else {
    // If request is not valid
    // return 401 not authenticated
    context.res = {
      status: 401,
      body: 'Not authenticated!',
    };
  }
};

export default httpTrigger;
