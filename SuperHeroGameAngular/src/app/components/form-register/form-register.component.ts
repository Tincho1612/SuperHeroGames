import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.css']
})
export class FormRegisterComponent {
   aux:number[]=[]
  form: FormGroup;
  constructor(private _data: UsersService,
    private readonly fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      apellido: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.min(5), Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    })
  }

  sendData() {
    let usuario: User = {
      nombre: this.form.value.name,
      apellido: this.form.value.apellido,
      email: this.form.value.email,
      password: this.form.value.password,
      favoritos:this.aux
       
    }

    if (this.validarEmail(this.form.value.email)) {
      this.toastr.success('Usuario creado con éxito', 'Registro exitoso');
      this._data.postUser(usuario)
      console.log(this._data.getusers())
      this.router.navigate(['login']);
    } else {
      this.toastr.error('Ese email ya está en uso, probá utilizando otro', 'Error');
    }

  }

  validarEmail(email: string): boolean {
    return !this._data.getusers().some(element => element.email === email);
  }

}
