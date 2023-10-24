import { compileNgModule } from '@angular/compiler';
import { Component } from '@angular/core';
import { Heroe } from 'src/app/interfaces/Heroe';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-tabla-heroes',
  templateUrl: './tabla-heroes.component.html',
  styleUrls: ['./tabla-heroes.component.css']
})
export class TablaHeroesComponent {

  listHeroes: Heroe[] = [];

  constructor(private _serviceHeroe: SuperHeroApiService){
    this.getHeroes();
  }

  getHeroes(){
    this._serviceHeroe.getHeroes().subscribe((data)=>{
      this.listHeroes = data.results;
      console.log(this.listHeroes);
    });
  }
  
}
