import { Router } from 'express'
import { agregarPelea } from '../controllers/Pelea.controller.js';
import { validarToken } from '../middlewares/validarToken.js';

const router = Router();

router.post('/agregar', validarToken, agregarPelea);

export default router;