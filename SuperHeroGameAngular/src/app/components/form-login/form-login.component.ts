import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.css']
})
export class FormLoginComponent {
  form: FormGroup;
  textoLogueo: string = "";

  constructor(private _data: SuperHeroApiService, 
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  verifyLogin() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      this.BuscarUsuario(this._data.getusers(), email, password);
    }
  }

  BuscarUsuario(usuarios: User[], email: string, password: string) {
    let usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado === undefined) {
      this.toastr.error('El usuario no fué encontrado', 'Error'); 
      console.log(usuarioEncontrado);
    } else {
      this.toastr.success('Inicio de sesión exitoso!', 'Ingresando');
      console.log(usuarioEncontrado);
      this.router.navigate(['lista']);
    }
  }
}
