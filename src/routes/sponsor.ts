import { Router } from 'express';
import { SponsorController } from '../controllers';
import { checkJwt, checkRole } from '../middlewares';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMIN'])], SponsorController.listAll);

router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], SponsorController.getOneById);

router.post('/', [checkJwt, checkRole(['ADMIN'])], SponsorController.newSponsor);

router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], SponsorController.editSponsor);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], SponsorController.deleteSponsor);

export default router;
