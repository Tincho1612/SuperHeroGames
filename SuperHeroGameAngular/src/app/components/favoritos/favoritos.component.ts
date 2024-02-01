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
  loading: boolean = false;
  idHeroeActual: number = 0;
  SuperheroesFav: Heroe[] = [];

  constructor(private _serviceHeroe: SuperHeroApiService,
    private _serviceUser: UsersService,
    private toastr: ToastrService) {
  }

  //Acciones para la tabla
  accionesFavoritos = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) },
    { label: 'Eliminar de favoritos', funcion: (heroe: Heroe) => this.eliminarFav(heroe.id) }];

  ngOnInit(): void {
    // Accede a la lista de favoritos del usuario desde el servicio
    this.recibirHeroes()
  }

  recibirHeroes(): any {
    this.loading = true;

    this._serviceUser.getFavoritosTest().subscribe({
      next: (data) => {
        {
          if (data && data.listaFavoritos) {
            const heroesid = data.listaFavoritos;

            const observables = heroesid.map((heroeId: number) => this._serviceHeroe.getHeroe(heroeId));

            forkJoin<Heroe[]>(observables).subscribe((heroesData: Heroe[]) => {
              this.SuperheroesFav = heroesData;
              this.loading = false;
            });
          } else {
            this.loading = false;
          }
        }
      },
      error: (e) => {
        this.loading = false;
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Error');
      }
    });
  }

  eliminarFav(id: string) {
    this._serviceUser.eliminarFavoritoUser(Number(id)).subscribe({
      next: (data) => {
        {
          this.SuperheroesFav.forEach((heroe) => {
            if (heroe.id == id) {
              const indice = this.SuperheroesFav.indexOf(heroe);
              if (indice !== -1) {
                this.SuperheroesFav.splice(indice, 1);
                this.toastr.error('El heroe fué eliminado de la lista de favoritos', 'Heroe eliminado');
              }
            }
          });
        }
      },
      error: (e) => {
        console.log(e);
        e.status === 429 ? this.toastr.error(e.error, 'Error') : this.toastr.error(e.error.message, 'Error');
      }
    });
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }
}
