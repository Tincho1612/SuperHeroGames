import { Schema, model } from "mongoose";

const peleaSchema = new Schema({
    idHeroe1: Number,
    idHeroe2: Number,
    idGanador: Number,
    fechaPelea: String
},
{
    versionKey: false
})

export default model ('Pelea', peleaSchema);