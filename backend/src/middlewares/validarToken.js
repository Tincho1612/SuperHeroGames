import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config.js';
import User from '../models/User.model.js'

export const validarToken = async (req, res, next) => {
    try {
        
    const token = req.headers["access-token"];

    if(!token) return res.status(403).json({message:"No hay token"});

    const tokenDecoded = jwt.verify(token, SECRET_KEY);
    req.userId = tokenDecoded.id; //Guardo el token en el request para luego utilizarlo en el controlador

    const user = await User.findById(req.userId); //El token tiene guardado el id del usuario

    if(!user) return res.status(404).json({message:"Usuario no encontrado"});

    next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Acceso no autorizado"});
    }
}