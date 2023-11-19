import express from 'express';

import { UserRole } from '../../../enum/user';
import auth from '../../middlewares/auth';
import { ProductController } from './product.controller';

const router = express.Router();




router.get('/:id', auth(UserRole.User),ProductController.getProductById );

router.get('/', auth(UserRole.User),ProductController.getAllProducts );




export const ProductRoutes = router;
