import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent {
  text: string = "Confirmando email...";
  token: string = '';
  loading: boolean = true;

  constructor(
    private _serviceUser: UsersService,
    private route: ActivatedRoute
  ){
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this._serviceUser.confirmarEmail(this.token).subscribe({
        next: (data) => {
          this.loading = false;
          this.text = "Email confirmado correctamente. Ya podés cerrar esta ventana!";
        },
        error: (e) => {
          this.loading = false;
           this.text = e.error; 
        }
      })
    })
  }
}
