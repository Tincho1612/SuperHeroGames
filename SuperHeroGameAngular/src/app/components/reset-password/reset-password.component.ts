import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _userService: UsersService,
    private navigate: Router
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  sendData() {
    this.loading = true;
    if (this.form.invalid) {
      this.toastr.error('Por favor, complete correctamente el formulario', 'Error');
      return;
    }

    this._userService.resetPassword(this.form.value.password, this.token).subscribe({
      next: (data) => {
        this.toastr.success(data.message, 'Contraseña cambiada!');
        this.navigate.navigate(['/login']);
      },
      error: (e) => {
        this.loading = false;
        console.log(e);
        this.toastr.error(e.error.message, 'Error');
      }
    });
  }

  passwordMatchValidator(group: FormGroup | null) {
    if (!group) {
      return null;
    }
  
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');
  
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }
  
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;
  
    return password === confirmPassword ? null : { mismatch: true };
  }
}
