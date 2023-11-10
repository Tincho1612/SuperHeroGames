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

  constructor(private _data: UsersService,
    private readonly fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private _dataHeroes: SuperHeroApiService) {

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
      favoritos: [],
      equipos: this.retornarHeroesRandom(),
      historial:[],
      primeraVez: true,
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

  retornarHeroesRandom(): Equipo[] {
    let repetidos: number[] = []
    const heroes: Equipo[] = []
    const nuevoEquipo: Equipo = { nombre: 'EquipoRandom', heroes: [] };
    heroes.push(nuevoEquipo)
    for (let i = 0; i < 5; i++) {

      // Genera un número aleatorio en el rango [0, 1) y luego lo ajusta al rango [1, 500]
      let numeroAleatorio: number = Math.floor(Math.random() * 500) + 1;

      while (this.isRepetido(repetidos, numeroAleatorio)) {
        repetidos.push(numeroAleatorio)
        numeroAleatorio = Math.floor(Math.random() * 500) + 1;
      }
      this._dataHeroes.getHeroe(numeroAleatorio).subscribe((data) => {
        heroes[0].heroes.push(data)
      });
    }
    return heroes
  }


  isRepetido(datos: number[], dato: number) {
    let encontrado = false;
    datos.forEach((element => {
      if (element === dato) {
        encontrado = true;
        return;
      }
    }))
    return encontrado;
  }


}
