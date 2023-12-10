import User from '../models/User.model.js'

export const verificarEmailDuplicado = async (req, res, next) => {

    const email = await User.findOne({email: req.body.email});

    if(email) return res.status(400).json({message: "El email ya está en uso"});

    next();

}