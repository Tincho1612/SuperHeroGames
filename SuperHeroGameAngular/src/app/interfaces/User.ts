import { Equipo } from "./Equipo"
import { Pelea } from "./pelea"

export interface User{
    nombre:string
    apellido:string
    email:string
    password:string
    favoritos?:number[]
    equipos: number[]
    historial: Pelea[]
    primeraVez:boolean
}