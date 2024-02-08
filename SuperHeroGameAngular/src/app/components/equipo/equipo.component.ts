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

  equipo: Heroe[] = [];
  idHeroeActual: number = 0;
  modal: boolean = false;
  loading: boolean = false;

  constructor(
    private _serviceUser: UsersService,
    private _data: SuperHeroApiService,
    private toastr: ToastrService) {
  }

  accionesEquipos = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) },
    { label: 'Agregar a favoritos', funcion: (heroe: Heroe) => this.cargarFavorito(heroe.id) }]

  ngOnInit(): void {
    this.cargarEquipos()
  }

  cargarFavorito(id: String) {
    this._serviceUser.agregarFavoritoUser(Number(id)).subscribe({
      next: (data) => {
        this.toastr.success(data.message, "Favoritos");
      },
      error: (e) => {
        console.log(e);
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Error');
      }
    })
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  cargarEquipos() {
    this.loading = true;
    this._serviceUser.getEquipoTest().subscribe({
      next: (data) => {
        data.listaEquipo.forEach((heroeId: Number) => {
          this.cargarheroe(heroeId);
        })
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Error');
      }
    })
  }

  cargarheroe(id: Number) {
    this._data.getHeroe(Number(id)).subscribe((data) => {
      this.equipo.push(data);
    })
  }
}

