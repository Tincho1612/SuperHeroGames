import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  drop(event:CdkDragDrop<Heroe[]>){
      moveItemInArray(this.heroes,event.previousIndex,event.currentIndex);
  }

  manejarImgError(heroe: Heroe) {
    heroe.image.url = "/assets/img/imagen-no-disponible.jpeg";
  }
}
