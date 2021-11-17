import {User, Visit} from '../../src/interfaces';

export const userExample: User = {
  userName: 'testName',
  passwordHash: 'testPassword',
};

export const visitExample: Visit = {
  UserId: '1',
  name: 'testName',
  dateCreated: '11-11-2021',
  visited: true,
  _id: '1',
  category: '',
  comments: [],
  pictureLink: [],
  tags: [],
  coordinates: {
    lat: '1',
    lon: '1',
  },
};
