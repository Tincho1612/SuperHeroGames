import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Equipo } from 'src/app/interfaces/Equipo';
import { Heroe } from 'src/app/interfaces/Heroe';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-tabla-heroes',
  templateUrl: './tabla-heroes.component.html',
  styleUrls: ['./tabla-heroes.component.css']
})
export class TablaHeroesComponent implements OnInit {
  allHeroes: Heroe[] = [];
  listHeroes: Heroe[] = [];
  modal = false;
  idHeroeActual = 0;
  loading = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  //Acciones de la tabla
  accionesTabla = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) },
    { label: 'Agregar a favoritos', funcion: (heroe: Heroe) => this.cargarFavorito(heroe.id) }];

  constructor(private _serviceHeroe: SuperHeroApiService,
    private aRouter: ActivatedRoute,
    private _serviceUser: UsersService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    //Para recibir el parametro de la url, el cual es ingresado en la barra de busqueda en la nav
    this.aRouter.paramMap.subscribe((params) => {
      const heroeParam = params.get('heroe');
      if (heroeParam === null) {
        this.getHeroesDefault();
      } else {
        this.getHeroesParam(heroeParam)
      }
    });
  }

  getHeroesDefault() {
    this.loading = true;
    this._serviceHeroe.getListHeroes().subscribe((data) => {
      this.allHeroes = data.results;
      this.currentPage = 1;
      this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
      this.loading = false;
    });
  }

  getHeroesParam(heroe: string) {
    this.loading = true;
    this._serviceHeroe.getHeroesByWord(heroe).subscribe((data) => {
      if (data.results && data.results.length > 0) {
        this.allHeroes = data.results;
        this.currentPage = 1;
        this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
        this.loading = false;
      } else {
        this.toastr.error('No se encontró ningún héroe con ese nombre o palabra clave', 'Error');
        this.getHeroesDefault();
      }
    })
  }

  paginateHeroes(heroes: Heroe[], page: number): Heroe[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return heroes.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.allHeroes.length) {
      this.currentPage++;
      this.listHeroes = this.paginateHeroes(this.allHeroes, this.currentPage);
    }
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  cargarFavorito(id: String) {
    this._serviceUser.agregarFavoritoUser(Number(id)).subscribe({
      next: (data) => {
        this.toastr.success(data.message, "Favoritos");
      },
      error: (e) => {
        console.log(e);
        if (e.status === 429) {
          this.toastr.error(e.error, 'Error');
        } else {
          this.toastr.error(e.error.message, 'Error');
        }
      }
    })
  }

}
