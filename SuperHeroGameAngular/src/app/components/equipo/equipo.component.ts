import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { Equipo } from 'src/app/interfaces/Equipo';
import { Heroe } from 'src/app/interfaces/Heroe';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {

  equipos: Equipo[]
  idHeroeActual: number = 0;
  modal: boolean = false;
  loading: boolean = false;


  constructor(private _userData: UsersService,
    private toast: ToastrService) {
    this.equipos = []
    if (this._userData.currentUser.primeraVez==true){
      this.toast.success('Bienvenido! se cargaron 5 heroes aleatorios por ser tu primera vez','Heroes')
      this._userData.currentUser.primeraVez=false;
      this._userData.updateUserData(this._userData.currentUser);
    }
  }
  accionesEquipos = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id)},
    { label: 'Agregar a favoritos', funcion: (heroe: Heroe) => this.cargarFavorito(heroe.id)}]

  ngOnInit(): void {
    this.equipos = this._userData.currentUser.equipos || [];
  }

  cargarFavorito(idHeroe: string) {
    const dato = Number(idHeroe);
    if (!this._userData.currentUser.favoritos?.includes(dato)) {
      // Si no existe, agrégalo al array
      this._userData.currentUser.favoritos?.push(Number(idHeroe))
      this._userData.updateUserData(this._userData.currentUser);
      this.toast.success('Heroe agregado a favoritos correctamente', 'Favorito');
    } else {
      this.toast.error('El heroe ya se encuentra en la lista de favoritos', 'Error');
    }
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }
}
