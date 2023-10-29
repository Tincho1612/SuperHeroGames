import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent {
  formulario:any=document.querySelector(".login-form");
  textoLogueo : string="";
  constructor(private _data: SuperHeroApiService){
    
    
  }

  
  verifyLogin(){
    const emailInput = document.querySelector(".login-form #email") as HTMLInputElement;
    const passwordInput = document.querySelector(".login-form #password") as HTMLInputElement;

    this.BuscarUsuario (this._data.getusers(), emailInput.value,passwordInput.value);
  }

  BuscarUsuario(usuarios: any[], email: string, password: string){
    
    let usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);
 
    if (usuarioEncontrado===undefined){
      this.textoLogueo = "Usuario no encontrado"; // Establece el contenido del elemento
      console.log(usuarioEncontrado);
    }else{
      this.textoLogueo = "Usuario encontrado"; // Establece el contenido del elemento
      console.log(usuarioEncontrado);
    }

    }

  }
