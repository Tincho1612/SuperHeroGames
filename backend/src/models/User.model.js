import { Schema, model } from "mongoose";

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
    
})

/*export interface User{
    nombre:string
    apellido:string
    email:string
    password:string
    favoritos?:number[]
    equipos: Equipo[]
    historial: Pelea[]
    primeraVez:boolean
}*/ 