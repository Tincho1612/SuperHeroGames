import { compileNgModule } from '@angular/compiler';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Heroe } from 'src/app/interfaces/Heroe';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-tabla-heroes',
  templateUrl: './tabla-heroes.component.html',
  styleUrls: ['./tabla-heroes.component.css']
})
export class TablaHeroesComponent{

  listHeroes: Heroe[] = [];
  modal: boolean = false;
  idHeroeActual: number = 0;  

  constructor(private _serviceHeroe: SuperHeroApiService){
    this.getHeroes();
  }

  getHeroes(){
    this._serviceHeroe.getListHeroes().subscribe((data)=>{
      this.listHeroes = data.results;
      console.log(this.listHeroes);
    });
  }

  abrirModal(id: string){
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }
  
}
