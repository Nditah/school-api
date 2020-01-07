/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity";
import { fail, success, notFound } from "../util";

class UserController {

static listAll = async (req: Request, res: Response) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find({
    select: ["id", "email", "role"]
  });
  return success(res, 200, users, null);
};

static getOneById = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "email", "role"] //We dont want to send the password on response
    });
    return success(res, null, user, null);
  } catch (error) {
    return notFound(res, null);
  }
};

static newUser = async (req: Request, res: Response) => {
  //Get parameters from the body
  let { email, password, role } = req.body;
  let user = new User();
  user.email = email;
  user.password = password;
  user.role = role;

  const errors = await validate(user);
  if (errors.length > 0) {
    return success(res, 400, errors, null);
  }

  //Hash the password, to securely store on DB
  user.hashPassword();

  //Try to save. If fails, the email is already in use
  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (e) {
    return fail(res, 409, "email already in use");
  }

  //If all ok, send 201 response
  return success(res, 201, "User created");
};

static editUser = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  //Get values from the body
  const { email, role } = req.body;

  //Try to find user on database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 404 response
    return notFound(res, "User not found");
  }

  //Validate the new values on model
  user.email = email;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    return fail(res, 400, errors.toString());
  }

  //Try to safe, if fails, that means email already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("email already in use");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      return fail(res, 404, "User not found");
      return;
    }
    userRepository.delete(id);
    return success(res, 204, null, null);
  };

}

export default UserController;
