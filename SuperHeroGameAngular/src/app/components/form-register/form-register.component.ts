import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {

  form: FormGroup;
  loading: boolean = false;
  modalMessage: string = ``;
  hidePassword: boolean = true;

  constructor(private _serviceUser: UsersService,
    private readonly fb: FormBuilder,
    private toastr: ToastrService,) {

    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z]+$/)]],
      apellido: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.email, Validators.min(5), Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    })
  }

  sendData() {
    this.loading = true;
    this.modalMessage = "";
    let usuario: User = {
      nombre: this.form.value.name,
      apellido: this.form.value.apellido,
      email: this.form.value.email,
      password: this.form.value.password,
      favoritos: [],
      equipos: [],
      historial: []
    }

    this._serviceUser.signUp(usuario).subscribe({
      next: (data) => {
        this.toastr.success(data.message, 'Registro exitoso');
        this.loading = false;
        this.modalMessage = `Recordá que podes confirmar tu email para que tu cuenta siga existiendo en un futuro! De igual manera
        te
        vamos a enviar recordatorios periodicamente, podes solicitar un envio de confirmación desde el
        apartado
        del usuario!
          <p>Tu cuenta tambien va a tener <strong>5 heroes disponibles</strong> para que los puedas utilizar en la
        ruleta!</p>`
      },
      error: (e) => {
        this.loading = false;
        const mensaje = typeof e.error === 'string' ? e.error : e.error?.message || 'Error';
        this.toastr.error(mensaje, 'Error');
}
    })
  }

  // Método para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
