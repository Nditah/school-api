import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { User } from "../entity";
import { fail } from "../util/response";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      return fail(res, 401, `Authorization Error: ${error.message}` );
    }
    //Check if array of authorized roles includes the user's role
    if (roles.includes(user.role)) next();
    else {
      console.log(user);
      return fail(res, 401, "Authorization user");
    }
  };
};
