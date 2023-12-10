import Joi from 'joi'

const schemaRegistro = Joi.object({
    nombre: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    apellido: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(8).max(24).required()
})

export const validarDatos = (req, res, next) => {

    const {nombre, apellido, email, password} = req.body;

    const validatorResult = schemaRegistro.validate({nombre, apellido, email, password});

    if(validatorResult.error) {
        return res.status(400).json({ 
            message:`Uno de los campos tiene un error`,
            error: validatorResult.error.details
        });
    }

    next();

}