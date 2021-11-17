import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  name: 'string',
  country: 'string',
  profilePic: 'string',
  userName: 'string',
  passwordHash: 'string',
}, {versionKey: false});

export const visitSchema = new mongoose.Schema({
  UserId: 'string',
  name: 'string',
  dateCreated: 'string',
  visited: 'boolean',
  comments: [{comment: 'string'}],
  tags: [{tag: 'string'}],
  category: 'string',
  pictureLink: [{link: 'string'}],
  coordinates: {
    lat: 'string',
    lon: 'string',
  },
}, {versionKey: false});

export interface userDocument extends Document {
  name: string;
  country: string;
  profilePic: string;
  userName: string;
  passwordHash: string;
}

export interface visitDocument extends Document {
  UserId: string;
  name: string;
  dateCreated: string;
  visited: boolean;
  comments: {
    comment: string;
  }[];
  tags: {
    tag: string;
  }[];
  category: string;
  pictureLink: {
    link: string;
  }[];
  coordinates: {
    lat: string
    lon: string
  };
}
