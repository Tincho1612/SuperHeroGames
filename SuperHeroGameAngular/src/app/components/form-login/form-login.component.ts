import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent {
  form: FormGroup;
  textoLogueo: string = "";

  constructor(private _data: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  verifyLogin() {

    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    this.BuscarUsuario(this._data.getusers(), email, password);
    
    this._data.signIn({email, password}).subscribe({
      next: (data) => {
        this.toastr.success(data.message, 'Ingresando');
        localStorage.setItem('token', data.token);
      },
      error: (e) => {
        this.toastr.error(e.error.message, 'Error');
      }
    })
  }

  BuscarUsuario(usuarios: User[], email: string, password: string) {
    let usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);
    if (usuarioEncontrado === undefined) {

      this.toastr.error('El mail o la contraseña son incorrectos', 'Error');

    } else {

      this.toastr.success('Inicio de sesión exitoso!', 'Ingresando');
      this._data.currentUser = usuarioEncontrado;
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
      this.router.navigate(['lista']);

    }
  }
}
