import { Pelea } from "./pelea"

export interface UserResponse{
    nombre:string
    apellido:string
    email:string
    password:string
    listaFavoritos?:number[]
    listaEquipo?: number[]
    historial: Pelea[]
}