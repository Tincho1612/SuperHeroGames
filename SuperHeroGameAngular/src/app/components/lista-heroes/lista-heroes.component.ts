import { Component, Input } from '@angular/core';
import { Heroe } from 'src/app/interfaces/Heroe';

@Component({
  selector: 'app-lista-heroes',
  templateUrl: './lista-heroes.component.html',
  styleUrls: ['./lista-heroes.component.css']
})
export class ListaHeroesComponent {

  @Input() heroes: Heroe[] = []; // Datos de los héroes
  @Input() acciones: any[] = []; // Botones personalizables

  realizarAccion(accion: any, heroe: Heroe) {
    accion.funcion(heroe);
  }
}
