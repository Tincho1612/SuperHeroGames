import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, numberAttribute } from '@angular/core';
import { EstadisticasHeroeService } from 'src/app/services/estadisticas-heroe.service';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.css']
})
export class ModalDetailsComponent implements OnInit {

  heroeActual: any;
  estadisticasHeroe: any;
  loading: boolean = false;

  constructor(private _serviceHeroe: SuperHeroApiService,
    private _serviceEstadisticas: EstadisticasHeroeService) { }

  @ViewChild('myModal')
  modalElement!: ElementRef;

  @Output() modalClosed = new EventEmitter<void>();

  @Input({ required: true, transform: numberAttribute }) id!: number;

  ngOnInit(): void {
    this.getHeroeModal();
  }

  cerrarModal() {
    this.modalElement.nativeElement.style.display = 'none';
    this.modalClosed.emit();
  }

  getHeroeModal() {
    this.loading = true;
    this._serviceHeroe.getHeroe(this.id).subscribe((data) => {
      this.heroeActual = data;
      this.estadisticasHeroe = this._serviceEstadisticas.getEstadisticasHeroe(this.heroeActual);
      this.loading = false;
    });
  }
}
