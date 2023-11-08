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
  listHeroes: Heroe[] = [];
  modal = false;
  idHeroeActual = 0;
  loading = false;

  //Acciones de la tabla
  accionesTabla = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id) },
    { label: 'Agregar a favoritos', funcion: (heroe: Heroe) => this.cargarFavorito(heroe.id)}];

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
      this.listHeroes = data.results;
      this.loading = false;
    });
  }

  getHeroesParam(heroe: string) {
    this.loading = true;
    this._serviceHeroe.getHeroesByWord(heroe).subscribe((data) => {
      this.listHeroes = data.results;
      this.loading = false;
    })
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  cargarFavorito(idHeroe: string) {
    const dato = Number(idHeroe);
    if (!this._serviceUser.currentUser.favoritos?.includes(dato)) {
      // Si no existe, agrégalo al array
      this._serviceUser.currentUser.favoritos?.push(Number(idHeroe))
      this._serviceUser.updateUserData(this._serviceUser.currentUser);
      this.toastr.success('Heroe agregado a favoritos correctamente', 'Favorito');
    } else {
      this.toastr.error('El heroe ya se encuentra en la lista de favoritos', 'Error');
    }
  }



  existeEnEquipo(heroe: Heroe): boolean {
    return !!this._serviceUser.currentUser.equipos?.some((equipo) => this.encontrarId(heroe, equipo.heroes));
  }

  encontrarId(heroe: Heroe, datos: Heroe[]): boolean {
    return datos.some((dato) => dato.id === heroe.id);
  }

}
