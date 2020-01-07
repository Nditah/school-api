import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity";
import config from "../config";
import { fail, success } from "../util";

class AuthController {

  static login = async (req: Request, res: Response) => {
    let { email, phone, password } = req.body;
    if (!(email && password || phone && password)) {
      return fail(res, 400, "Incorrect credentials!");
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      return fail(res, 401, "Login failed!");
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      return fail(res, 401, "Login failed!");
    }
    const { id: userId, role } = user;
    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId, email, phone, role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );
    return success(res, 200, token, "Login successful");
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      return fail(res, 400, "Incorrect credentials!");
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (err) {
      return fail(res, 401, `Login failed: ${err.message}`);
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      return fail(res, 401, "Incorrect password");
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      return fail(res, 400, null);
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);
    return success(res, 204, "New password set successfully");
  };
}
export default AuthController;
