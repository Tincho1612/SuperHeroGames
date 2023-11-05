import { Component, OnInit } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { Heroe } from 'src/app/interfaces/Heroe';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  modal: boolean = false;
  idHeroeActual: number = 0;
  loading: boolean = false;
  favoritos: number[] = [];
  SuperheroesFav: Heroe[] = [];

  constructor(private _data: SuperHeroApiService,
    private _dataUsers: UsersService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    // Accede a la lista de favoritos del usuario desde el servicio
    this.favoritos = this._dataUsers.currentUser.favoritos || [];
    this.recibirHeroesFav(this.favoritos);
  }

  recibirHeroesFav(ids: number[]) {
    this.SuperheroesFav = []; // Vacía el arreglo, así cuando elimino se sale del array y recargo todo

    const observables = ids.map(id => this._data.getHeroe(id)); //Se maneja similar al Promise.All de js, es basicamente para que maneje todas las request en una

    this.loading = true;
    forkJoin(observables).subscribe({
      next: (heroes) => {
        this.SuperheroesFav = heroes;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  eliminarFavorito(idHeroe: string) {
    const idNumero = Number(idHeroe);

    this.favoritos.splice(this.favoritos.indexOf(idNumero), 1); ///elimino el dato basandome en la posicion que lo tomo con index
    this.recibirHeroesFav(this.favoritos);

    this.toastr.error('El heroe fué eliminado de la lista de favoritos', 'Heroe eliminado');
  }

}
