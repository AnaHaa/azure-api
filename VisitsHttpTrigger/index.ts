import {AzureFunction, Context, HttpRequest} from '@azure/functions';
import AuthModule from '../src/modules/AuthModule';
import Visits from '../src/modules/VisitModule';

const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const auth = new AuthModule();
  const visits = new Visits();

  // Check if the request is valid
  const validRequest = await auth.authRequest(req.headers);

  // If request is valid
  // proceed with logic
  if (validRequest) {
    try {
      if (req.method === 'GET') {
        if (req.query.UserId) {
          // Find all visit objects with userId
          const responseMessage = await visits.getVisits(req.query.UserId);

          context.res = {
            ...responseMessage,
          };
        } else {
          context.res = {
            status: 400,
            body: 'No UserId in query!',
          };
        }
      } else if (req.method === 'PUT') {
        // Upsert new or existing visit object
        const responseMessage = await visits.putVisits(req.body);

        context.res = {
          ...responseMessage,
        };
      } else if (req.method === 'DELETE') {
        if (req.query.visitId) {
          // Delete existing visit object
          const responseMessage = await visits.deleteVisit(req.query.visitId);

          context.res = {
            ...responseMessage,
          };
        } else {
          context.res = {
            status: 400,
            body: 'No visitId in query!',
          };
        }
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
