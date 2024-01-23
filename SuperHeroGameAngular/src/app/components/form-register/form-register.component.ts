import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Equipo } from 'src/app/interfaces/Equipo';
import { User } from 'src/app/interfaces/User';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {

  form: FormGroup;
  loading: boolean = false;

  constructor(private _data: UsersService,
    private readonly fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private _dataHeroes: SuperHeroApiService) {

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
    let usuario: User = {
      nombre: this.form.value.name,
      apellido: this.form.value.apellido,
      email: this.form.value.email,
      password: this.form.value.password,
      favoritos: [],
      equipos: [],
      historial: [],
      primeraVez: true,
    }

    this._data.signUp(usuario).subscribe({
      next: (data) => {
        this.toastr.success(data.message, 'Registro exitoso');
        this.router.navigate(['login']);  
      },
      error: (e) => {
        this.loading = false
        console.log(e);
        this.toastr.error(e.error.message, 'Error');
      }
    })
  }

}
