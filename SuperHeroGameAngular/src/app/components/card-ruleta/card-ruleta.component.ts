import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Heroe } from 'src/app/interfaces/Heroe';

@Component({
  selector: 'app-card-ruleta',
  templateUrl: './card-ruleta.component.html',
  styleUrls: ['./card-ruleta.component.css']
})
export class CardRuletaComponent {

  @Input({ required: true}) heroe?: Heroe; // Recibe el héroe como entrada desde el componente padre.
  @Input({ required: true}) estadisticas: any; // Recibe las estadísticas como entrada desde el componente padre.
  @Input() isSpinning: boolean = false;
  @Output() eliminarHeroeEvent = new EventEmitter<void>();

  eliminarHeroe() {
    // Coloca aquí la lógica para eliminar el héroe si es necesario.
    this.eliminarHeroeEvent.emit();
  }

}

