import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config';
import User from '../models/User.model.js'

export const validarToken = async (req, res, next) => {
    try {
        
    const token = req.headers["access-token"];

    if(!token) return res.status(403).json({message:"No hay token"});

    const tokenDecoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(tokenDecoded.id); //El token tiene guardado el id del usuario

    if(!user) return res.status(404).json({message:"Usuario no encontrado"});

    next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({message:"Acceso no autorizado"});
    }
}