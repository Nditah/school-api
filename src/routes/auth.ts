import { Router } from 'express';
import { AuthController } from '../controllers';
import { checkJwt } from '../middlewares';

const router = Router();
// Login route
router.post('/login', AuthController.login);

// Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
