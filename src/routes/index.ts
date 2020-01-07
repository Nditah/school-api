import { Router } from 'express';
import auth from './auth';
import user from './user';
import employee from './employee';
import sponsor from './sponsor';
import student from './student';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/employee', employee);
routes.use('/sponsor', sponsor);
routes.use('/student', student);

export default routes;
