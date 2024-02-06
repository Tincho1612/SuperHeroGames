import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  formEmail: FormGroup;
  formPassword: FormGroup;
  actualUser!: User;
  textoLogueo: string = "";
  isConfirmed: boolean;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _serviceUser: UsersService) {
    this._serviceUser.getActualUser().subscribe((data) => {
      this.actualUser = data.userResponse
    })

    this.formEmail = this.fb.group({
      emailActual: ['', [Validators.required, Validators.email]],
      emailNuevo: ['', [Validators.required, Validators.email]]
    });
    this.formPassword = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      passwordNueva: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    })

    this.isConfirmed = this._serviceUser.getConfirmed();
    console.log(this._serviceUser.getConfirmed());
  }

  changeEmail() {
    if (this.formEmail.valid) {
      const actualEmail = this.formEmail.get('emailActual')?.value;
      const newEmail = this.formEmail.get('emailNuevo')?.value;

      if (actualEmail == this.actualUser.email) {
        this._serviceUser.updateUser({ email: newEmail }).subscribe({
          next: (data) => {
            this.toastr.success(data.message, "Actualización de email");
            this.actualUser.email = newEmail;
          },
          error: (e) => {
            e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Actualización de email');
          }
        })
      } else {
        this.toastr.error("El mail actual es incorrecto", "Actualización de email");
      }

      this.formEmail.reset();
    }
  }

  changePassword() {

    if (this.formPassword.valid) {
      const actualPassword = this.formPassword.get('passwordActual')?.value;
      const newPassword = this.formPassword.get('passwordNueva')?.value;

      this._serviceUser.updatePassword({ actualPassword: actualPassword, newPassword: newPassword }).subscribe({
        next: (data) => {
          this.toastr.success(data.message, "Actualización de contraseña");
        },
        error: (e) => {
          e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Actualización de contraseña');
        }
      });

      this.formPassword.reset();
    }
  }

  enviarEmail(){
    this._serviceUser.requestConfirmationEmail(this.actualUser.email).subscribe({
      next: (data) => {
        this.toastr.success(data.message + ". Recordá que tenés una hora para aceptarlo.", "Confirmación de mail");
      },
      error: (e) => {
        console.log(e);
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Confirmación de mail');
      }
    })
  }
}
