import User from '../models/User.model.js';
import Pelea from '../models/Pelea.model.js';

export const agregarPelea = async (req, res) => {
    try {
        const { idHeroe1, idHeroe2, idGanador, fechaPelea } = req.body;
        const userId = req.userId;

        const newPelea = new Pelea({
            idHeroe1,
            idHeroe2,
            idGanador,
            fechaPelea
        })

        const savedPelea = await newPelea.save();

        const actualUser = await User.findByIdAndUpdate(userId, { $push: { historial: savedPelea._id } }, { new: true })

        return res.status(200).json({
            message: "La pelea se guardó correctamente",
            actualUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Ocurrió un error inesperado"})
    }
}