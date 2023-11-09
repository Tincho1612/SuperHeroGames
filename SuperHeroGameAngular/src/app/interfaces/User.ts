import { Equipo } from "./Equipo"

export interface User{
    nombre:string
    apellido:string
    email:string
    password:string
    favoritos?:number[]
    equipos: Equipo[]
    primeraVez:boolean
}