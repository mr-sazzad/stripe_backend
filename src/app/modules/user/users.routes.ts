import express from 'express';

import { UserController } from './users.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../enum/user';

const router = express.Router();

router.post('/create-user', UserController.createUser);
router.patch('/:id', UserController.updateUserById);
router.get('/:id', UserController.getUserById);

router.delete('/:id', auth(UserRole.Admin,UserRole.Super_Admin),UserController.deleteUserById);
router.get('/',auth(UserRole.Admin,UserRole.Super_Admin), UserController.getAllUsers);
router.get('/all',auth(UserRole.Admin,UserRole.Super_Admin,UserRole.User), UserController.getAllUsersPagination);

export const UserRoutes = router;
