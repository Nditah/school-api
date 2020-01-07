import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Student } from "../entity";

class StudentController {

static listAll = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(Student);
  const users = await userRepository.find({
    select: ["id", "surname", "phone"]
  });

  //Send the users object
  res.send(users);
};

static getOneById = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id: number = parseInt(req.params.id);

  //Get the user from database
  const userRepository = getRepository(Student);
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "surname", "phone"] 
    });
  } catch (error) {
    res.status(404).send("Student not found");
  }
};

static newStudent = async (req: Request, res: Response) => {
  //Get parameters from the body
  let { surname, password, email, phone } = req.body;
  let user = new Student();
  user.email = email;
  user.phone = phone;
  user.password = password;
  user.surname = surname;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.hashPassword();

  //Try to save. If fails, the username is already in use
  const userRepository = getRepository(Student);
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("username already in use");
    return;
  }

  //If all ok, send 201 response
  res.status(201).send("Student created");
};

static editStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  let { surname, password, email, phone } = req.body;

  const userRepository = getRepository(Student);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 404 response
    res.status(404).send("Student not found");
    return;
  }

  //Validate the new values on model
  user.email = email;
  user.phone = phone;
  user.password = password;
  user.surname = surname;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Try to safe, if fails, that means username already in use
  try {
    await userRepository.save(user);
  } catch (e) {
    res.status(409).send("user already in records");
    return;
  }
  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};

static deleteStudent = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id = req.params.id;

  const userRepository = getRepository(Student);
  let user: Student;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    res.status(404).send("Student not found");
    return;
  }
  userRepository.delete(id);

  //After all send a 204 (no content, but accepted) response
  res.status(204).send();
};
};

export default StudentController;
