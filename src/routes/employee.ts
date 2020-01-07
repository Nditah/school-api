import { Router } from "express";
import { EmployeeController } from "../controllers";
import { checkJwt, checkRole } from "../middlewares";


const router = Router();

router.get(
  "/",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.listAll
);

router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.getOneById
);

router.post(
  "/",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.newEmployee
);

router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.editEmployee
);

router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.deleteEmployee
);

export default router;
