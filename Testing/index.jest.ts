import {userExample, visitExample} from './data';
import {User, Visit} from '../src/interfaces';
import UserModule from '../src/modules/UserModule';
import VisitModule from '../src/modules/VisitModule';
import CosmosModule from '../src/modules/CosmosModule';

jest.mock('../src/modules/CosmosModule');
jest.useFakeTimers();

describe('UsersHttpTrigger', () => {
  test('getUsers', async () => {
    CosmosModule.prototype.findUser = jest.fn(
        async (): Promise<User> => userExample,
    );

    const userModuleTest = new UserModule();
    const result = await userModuleTest.getUsers(userExample.userName, userExample.passwordHash);

    expect(result).toStrictEqual({
      'body': {
        ...userExample,
      },
      'status': 200,
    });
  });

  test('postUsers', async () => {
    CosmosModule.prototype.checkUser = jest.fn(
        async (): Promise<boolean> => false,
    );

    CosmosModule.prototype.insertUser = jest.fn(
        async (): Promise<boolean> => true,
    );

    const userModuleTest = new UserModule();
    const result = await userModuleTest.postUsers(userExample);

    expect(result).toStrictEqual({
      'body': 'User upsert!',
      'status': 201,
    });
  });
});

describe('VisitsHttpTrigger', () => {
  test('getVisits', async () => {
    CosmosModule.prototype.getVisits = jest.fn(
        async (): Promise<Visit[]> => [visitExample],
    );

    const visitModuleTest = new VisitModule();
    const result = await visitModuleTest.getVisits('1');

    expect(result).toStrictEqual({
      'body': [visitExample],
      'status': 200,
    });
  });

  test('putVisits', async () => {
    CosmosModule.prototype.upsertVisit = jest.fn(
        async (): Promise<boolean> => true,
    );

    const visitModuleTest = new VisitModule();
    const result = await visitModuleTest.putVisits(visitExample);

    expect(result).toStrictEqual({
      'body': 'Visit upsert!',
      'status': 201,
    });
  });
});
