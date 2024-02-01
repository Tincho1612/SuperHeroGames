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
  loading: boolean = false;

  constructor(private _serviceUser: UsersService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  verifyLogin() {
    this.loading = true;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;
    
    this._serviceUser.signIn({email, password}).subscribe({
      next: (data) => {
        this.toastr.success(data.message, 'Ingresando');
        localStorage.setItem('token', data.token);
        this.router.navigate(['/lista']);
      },
      error: (e) => {
        this.loading = false
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Error');
      }
    })
  }
}
