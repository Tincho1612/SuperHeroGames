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
    private toastr: ToastrService, private users_: UsersService) {
    this.formEmail = this.fb.group({
      emailActual: ['', [Validators.required, Validators.email]],
      emailNuevo: ['', [Validators.required, Validators.email]]
    });
    this.formPassword = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      passwordNueva: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    })
  }

  changeEmail() {
    if (this.formEmail.valid) {
      const actual = this.formEmail.get('emailActual')?.value;
      const nuevo = this.formEmail.get('emailNuevo')?.value;
      if (this.validarEmail(nuevo)) {
        if (this.users_.currentUser.email == actual) {
          this.users_.listusers.forEach(element => {
            if (element.email == this.users_.currentUser.email) {
              element.email = nuevo
              this.users_.currentUser.email = nuevo
              this.users_.updateUserData(this.users_.currentUser)
              console.log(this.users_.currentUser)
              this.toastr.success('Se cambio el email correctamente', 'updateUser')
            }
          });
        } else {
          this.toastr.error('El Email actual ingresado no es correcto', 'updateuser')
        }
      }
      else {
        this.toastr.error('Este email ya esta en uso', 'updateUser')
      }
    }


  }

  changePassword() {
    if (this.formPassword.valid) {
      const actual = this.formPassword.get('passwordActual')?.value;
      const nuevo = this.formPassword.get('passwordNueva')?.value;
      if (this.users_.currentUser.password == actual) {

        this.users_.listusers.forEach(element => {
          if (element.password == actual) {
            element.password = nuevo
            this.users_.currentUser.password = nuevo
            this.users_.updateUserData(this.users_.currentUser)
            console.log(this.users_.currentUser)
            this.toastr.success('Se cambio la contraseña correctamente', 'updateUser')
          }
        });
      }else{
        this.toastr.error('La contraseña actual es incorrecta','updateUser')
      }
    }
  }


  validarEmail(email: string): boolean {
    return !this.users_.getusers().some(element => element.email === email);
  }
}
