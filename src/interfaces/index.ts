export interface User {
    _id?: string,
    name?: string,
    country?: string,
    profilePic?: string,
    userName: string,
    passwordHash: string
};

export interface Visit {
    UserId: string,
    _id?: string,
    name: string,
    dateCreated: string,
    visited: boolean,
    comments?: object [],
    tags?: object [],
    category?: string,
    pictureLink?: object [],
    coordinates: {
        lat: string,
        lon: string,
    }
};

export interface RequestHeader {
  apikey?: string,
};

export interface Status {
  status: number,
  body: object | string
};
