import { Router } from 'express';
import { signUp, signIn } from '../controllers/Auth.controller.js';

//middlewares
import { verificarEmailDuplicado } from '../middlewares/verificarEmail.js';
import { validarDatos } from '../middlewares/validarDatos.js';

const router = Router();

router.post('/signup', [verificarEmailDuplicado, validarDatos], signUp);
router.post('/signin', signIn);

export default router;
