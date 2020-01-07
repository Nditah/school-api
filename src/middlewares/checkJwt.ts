import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import { extractJwtToken, fail } from '../util';
import { User } from '../entity';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  let jwtPayload;
  // Try to validate the token and get data
  try {
    jwtPayload = extractJwtPayload(req);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return fail(res, 401, `Authentication Error: ${error.message}`);
  }
  // The token is valid for 4 hour
  // We want to send a new token on every request
  const { userId, email, phone, role } = jwtPayload;
  const newToken = jwt.sign({ userId, email, phone, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
  res.setHeader('token', newToken);
  next();
};

const extractJwtPayload = (req: Request) => {
  try {
    return <any>jwt.verify(extractJwtToken(req), config.jwtSecret);
  } catch {
    return null;
  }
};

/**
 * Attach currently login user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
export const attachThisUser = async (req, res, next) => {
  const { userId } = extractJwtPayload(req);
  const userRepository = getRepository(User);
  try {
    const currentUser = await userRepository.findOneOrFail(userId, {
      select: ['id', 'email', 'phone', 'role'],
    });
    req.currentUser = currentUser;
    return next();
  } catch (error) {
    return next(error);
  }
};
