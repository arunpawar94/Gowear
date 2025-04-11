import { Router } from 'express';
import upload from '../config/multerConfig';
import { addProduct } from '../controllers/product';

const router = Router();

router.post('/add_product', upload.array('images', 5), addProduct);

export default router;
