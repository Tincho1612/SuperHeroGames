import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';

export const signUp = async (req, res) => {
    const { nombre, apellido, email, password, } = req.body;

    const newUser = new User({
        nombre,
        apellido,
        email,
        password: await User.encryptPassword(password)
    })

    const savedUser = await newUser.save();

    res.status(200).json({ message:"Usuario registrado con éxito" });
}

export const signIn = async (req, res) => {
    
    const userFound = await User.findOne({ email: req.body.email });

    if(!userFound) {
        return res.status(400).json({token: null, message:"Usuario no encontrado"});
    }

    const matchPassword = await User.comparePassword(req.body.password, userFound.password);

    if(!matchPassword) {
        return res.status(401).json({ token: null, message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: userFound._id }, SECRET_KEY, {
        expiresIn: 86400 //1 dia!!
    })

    res.json({token});

}