import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string = '';
  loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private _userService: UsersService
  ) {

  }

  onSubmit() {
    this.loading = true;
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (this.email.match(emailRegex)) {

      this._userService.recuperarPassword(this.email).subscribe({
        next: (data) => {
          this.loading = false;
          this.toastr.success(data.message, 'Correo enviado!');
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(e.error.message, 'Error');
        }
      })
    } else {
      this.toastr.error('Asegurese de ingresar un mail válido', 'Formato erroneo');
      this.loading = false;
    }
  }
}
