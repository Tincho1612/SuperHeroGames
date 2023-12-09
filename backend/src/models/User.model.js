import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    nombre: {
        type: String,
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favoritos: [Number],
    equipos: [Number],
    historial: [{
        ref: 'Pelea',
        type: Schema.Types.ObjectId
    }],
    primeraVez: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (receivedPassword, password) => {
    return await bcrypt.compare(receivedPassword, password);
}

export default model('User', userSchema);