import { Router } from 'express';
import { StudentController } from '../controllers';
import { checkJwt, checkRole } from '../middlewares';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMIN'])], StudentController.listAll);

router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], StudentController.getOneById);

router.post('/', [checkJwt, checkRole(['ADMIN'])], StudentController.newStudent);

router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], StudentController.editStudent);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], StudentController.deleteStudent);

export default router;
