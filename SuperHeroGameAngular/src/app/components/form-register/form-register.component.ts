import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/User';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent implements OnInit {
  formulario:any=document.querySelector(".registration-form");
  registerForm:FormGroup;
  constructor(private _data: SuperHeroApiService,private readonly fb:FormBuilder){
    
    this.registerForm = this.fb.group({
      name:['',[Validators.required,Validators.minLength(4),Validators.maxLength(10)]],
      apellido:['',[Validators.required,Validators.minLength(4),Validators.maxLength(10)]],
      email:['',[Validators.email,Validators.min(5),Validators.required]],
      password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(24)]]
    })
  }
  ngOnInit(): void {

  }
  


  sendData(){
      let usuario:User
      const name = this.registerForm.get('name')
      const lastName = this.registerForm.get('apellido')
      const email = this.registerForm.get('email')
      const password = this.registerForm.get('password')
      if (name?.errors || lastName?.errors || email?.errors || password?.errors){
        alert("Algunos de los campos no son validos: Recuerde que la contraseña debe contener entre 8 y 24 caracteres y todos los campos son requeridos")
      }else{
        if (this.validarEmail(email?.value)){
          this._data.postUser(new User(name?.value,lastName?.value,email?.value,password?.value))
          console.log(this._data.getusers())
        }else{
          alert("Ese Email ya esta en uso")
        }
        
      }
  }

  validarEmail(email:string):boolean{
      let validado=true;
      this._data.getusers().forEach(element => {
        if (element.email==email){
          validado==false
        }
      });
      return validado;
  }
  

}
