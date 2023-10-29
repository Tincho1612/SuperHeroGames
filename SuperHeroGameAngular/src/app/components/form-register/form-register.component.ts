import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {
  formulario:any=document.querySelector(".registration-form");
  constructor(private _data: SuperHeroApiService){
    
    
  }

  


  sendData(){
    const nameInput = document.querySelector(".registration-form #name") as HTMLInputElement;
    const apellidoInput = document.querySelector(".registration-form #apellido") as HTMLInputElement;
    const emailInput = document.querySelector(".registration-form #email") as HTMLInputElement;
    const passwordInput = document.querySelector(".registration-form #password") as HTMLInputElement;

    this._data.postUser(new User(nameInput.value, apellidoInput.value, emailInput.value, passwordInput.value))
    console.log(this._data.getusers())
  }
  

}
