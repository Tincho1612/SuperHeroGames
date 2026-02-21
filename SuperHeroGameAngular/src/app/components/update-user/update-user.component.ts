import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from 'src/app/interfaces/UserResponse';
import { UsersService } from 'src/app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  formEmail: FormGroup;
  formPassword: FormGroup;
  actualUser!: UserResponse;
  textoLogueo: string = "";
  isConfirmed: boolean;

  loading: boolean = false;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _serviceUser: UsersService) {
    this._serviceUser.getActualUser().subscribe((data) => {
      this.actualUser = data;
    })

    this.formEmail = this.fb.group({
      emailNuevo: ['', [Validators.required, Validators.email]],
      confirmarEmailNuevo: ['', [Validators.required, Validators.email]]
    });
    this.formPassword = this.fb.group({
      passwordActual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      passwordNueva: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    });

    this.isConfirmed = this._serviceUser.getConfirmed();
  }

  changeEmail() {
    if (this.formEmail.valid) {
      const newEmail = this.formEmail.get('emailNuevo')?.value;
      const confirmNewEmail = this.formEmail.get('confirmarEmailNuevo')?.value;

      if (newEmail == confirmNewEmail) {
        this.loading = true;
        this._serviceUser.updateUser({ email: newEmail}).subscribe({
          next: (data) => {
            this.toastr.success(
              "Email modificado con exito!! Recuerda verificar tu casilla de correo para confirmar el nuevo email."
              , "Actualización de email", {
              timeOut: 8500
            });
            this.actualUser.email = newEmail;
            this.loading = false;
          },
          error: (e) => {
            this.loading = false;
            if (e.status === 400 || e.status === 409) {
                this.toastr.error(e.error, 'Actualización de email');
              } else {
                this.toastr.error('Ocurrió un error inesperado', 'Actualización de email');
              }
          }
        })
      } else {
        this.toastr.error("El nuevo mail debe coincidir en ambos campos", "Actualización de email");
      }

      this.formEmail.reset();
    }
  }

  changePassword() {
    if (this.formPassword.valid) {
      const actualPassword = this.formPassword.get('passwordActual')?.value;
      const newPassword = this.formPassword.get('passwordNueva')?.value;

      if (actualPassword === newPassword) {
        this.toastr.error("La nueva contraseña no puede ser igual a la actual", "Actualización de contraseña");
      } else {  
        this.loading = true;
        this._serviceUser.updatePassword({ actualPassword: actualPassword, newPassword: newPassword }).subscribe({
          next: (data) => {
            this.toastr.success("Contraseña modificada con exito", "Actualización de contraseña");
            this.loading = false;
          },
          error: (e: HttpErrorResponse) => {
          this.loading = false;

          const message = e.error as string;

          this.toastr.error(message, 'Actualización de contraseña');
}
        });
      }
      this.formPassword.reset();
    }
  }

  enviarEmail() {
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
