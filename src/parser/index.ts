import bcrypt from 'bcryptjs';
import {User, Visit} from '../interfaces';

/**
 * Parses the object into User object
 * @param {User} req unknown object
 * @return {User} User object
 */
export async function parsePostUser(req: User): Promise<User> {
  // Create salt and hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.passwordHash, salt);

  const result: User = {
    'name': req.name || '',
    'country': req.country || '',
    'profilePic': req.profilePic || '',
    'userName': req.userName,
    'passwordHash': passwordHash,
  };

  return result;
}

/**
 * Parses the object into User object
 * @param {User} req unknown object
 * @return {User} User object
 */
export async function parsePutUser(req: User): Promise<User> {
  const result: User = {
    'name': req.name || '',
    'country': req.country || '',
    'profilePic': req.profilePic || '',
    'userName': req.userName,
    'passwordHash': req.passwordHash,
  };

  return result;
}

/**
 * Parses the object into Visit object
 * @param {Visit} req unknown object
 * @return {Visit} Visit object
 */
export function parseVisit(req: Visit): Visit {
  const result: Visit = {
    'UserId': req.UserId,
    '_id': req._id || '',
    'name': req.name,
    'dateCreated': req.dateCreated,
    'visited': req.visited,
    'comments': req.comments || [],
    'tags': req.tags || [],
    'category': req.category || '',
    'pictureLink': req.pictureLink || [],
    'coordinates': req.coordinates,
  };

  return result;
}
