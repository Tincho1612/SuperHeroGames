export class User{
    nombre:string
    apellido:string
    email:string
    password:string
    favoritos: any[]
    constructor(nombre:string,apellido:string,correo:string,password:string,favoritos:any[]){
        this.nombre=nombre
        this.apellido=apellido
        this.email=correo
        this.password=password
        this.favoritos=favoritos;
    }
    
}