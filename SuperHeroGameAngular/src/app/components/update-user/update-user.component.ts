import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  formEmail: FormGroup;
  formPassword: FormGroup;
  textoLogueo: string = "";
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,private users_:UsersService){
      this.formEmail = this.fb.group({
        emailActual: ['', [Validators.required, Validators.email]],
        emailNuevo: ['', [Validators.required, Validators.email]]
      });
      this.formPassword = this.fb.group({
        passwordActual:['', [Validators.required,Validators.minLength(8), Validators.maxLength(24)]],
        passwordNueva:['', [Validators.required,Validators.minLength(8), Validators.maxLength(24)]]
      })
  }

  changeEmail(){
    if (this.formEmail.valid){
      const actual = this.formEmail.get('emailActual')?.value;
      const nuevo = this.formEmail.get('emailNuevo')?.value;
      if (this.validarEmail(nuevo)){
        this.users_.listusers.forEach(element => {
          if (element.email==actual){
            element.email= nuevo
            this.users_.currentUser.email=nuevo
            this.users_.updateUserData(this.users_.currentUser)
            console.log(this.users_.currentUser)
            this.toastr.success('Se cambio el email correctamente','updateUser')
          }else{
            this.toastr.error('Hubo un error al cambiar el email','updateUser')
          }
        });
      }
      else{
        this.toastr.error('Este email ya esta en uso','updateUser')
      }
      }
      
    
  }

  changeEmailTest(){
    if (this.formEmail.valid){
      const actual = this.formEmail.get('emailActual')?.value;
      const nuevo = this.formEmail.get('emailNuevo')?.value;
      if (actual && nuevo){
        this.users_.updateUser({email:nuevo}).subscribe({
          next: (data) => {
             this.toastr.success("ChangeEmail","Se cambio el Email correctamente")
          },
          error: (e) => {
            this.toastr.error("ChangeEmail","El email ya esta en uso")
          }
        })
      }
      else{
        this.toastr.error('No coinciden los email','updateUser')
      }
      }
  }

  changePassword(){
    if (this.formPassword.valid){
      const actual = this.formPassword.get('passwordActual')?.value;
      const nuevo = this.formPassword.get('passwordNueva')?.value;
      this.users_.listusers.forEach(element => {
        if (element.password==actual){
          element.password= nuevo
          this.users_.currentUser.password=nuevo
          this.users_.updateUserData(this.users_.currentUser)
          console.log(this.users_.currentUser)
          this.toastr.success('Se cambio la contraseña correctamente','updateUser')
        }else{
          this.toastr.error('Hubo un error al cambiar la contraseña','updateUser')
        }
      });
    }
  }
  validarEmail(email: string): boolean {
    return !this.users_.getusers().some(element => element.email === email);
  }
}
