import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  modal: boolean = false;
  idHeroeActual: number = 0;
  loading: boolean = false;

  constructor(private _serviceHeroe: SuperHeroApiService, private aRouter: ActivatedRoute,private _serviceUser:UsersService) { }

  ngOnInit(): void {
    //Para recibir el parametro de la url, el cual es ingresado en la barra de busqueda en la nav
    this.aRouter.paramMap.subscribe((params) => {
      const heroeParam = params.get('heroe');
      console.log(heroeParam);
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
      console.log(this.listHeroes);
      this.loading = false;
    });
  }

  getHeroesParam(heroe: string) {
    this.loading = true;
    this._serviceHeroe.getHeroesByWord(heroe).subscribe((data)=>{
      this.listHeroes = data.results;
      console.log(this.listHeroes);
      this.loading = false;
    })
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }
  cargarFavorito(idHeroe:string){
    const dato= Number (idHeroe);
    if (!this._serviceUser.currentUser.favoritos?.includes(dato)) {
      // Si no existe, agrégalo al array
      this._serviceUser.currentUser.favoritos?.push(Number(idHeroe))
    }
    
    console.log (this._serviceUser.currentUser);
  }
}
