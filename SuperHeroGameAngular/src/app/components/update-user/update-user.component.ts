import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  formEmail: FormGroup;
  textoLogueo: string = "";
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,private users_:UsersService){
      this.formEmail = this.fb.group({
        emailActual: ['', [Validators.required, Validators.email]],
        emailNuevo: ['', [Validators.required, Validators.email]]
      });
  }

  changeEmail(){
    if (this.formEmail.valid){
      const actual = this.formEmail.get('emailActual')?.value;
      const nuevo = this.formEmail.get('emailNuevo')?.value;
      this.users_.listusers.forEach(element => {
        if (element.email==actual){
          element.email= nuevo
          this.users_.currentUser.email=nuevo
          this.users_.updateUserData(this.users_.currentUser)
          console.log(this.users_.currentUser)
        }
      });
    }
    
  }
}
