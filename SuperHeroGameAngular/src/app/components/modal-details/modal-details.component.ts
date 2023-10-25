import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, numberAttribute } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.css']
})
export class ModalDetailsComponent implements OnInit {

  heroeActual: any;
  estadisticasHeroe: any;

  constructor(private _serviceHeroe: SuperHeroApiService) {
  }

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
    this._serviceHeroe.getHeroe(this.id).subscribe((data) => {
      this.heroeActual = data;
      this.estadisticasHeroe = this.getEstadisticasHeroe(this.heroeActual);
    });
  }

  getEstadisticasHeroe(heroe: any) {
    const { combat, durability, intelligence, power, speed, strength } = heroe.powerstats;

    const combatValue = parseInt(combat) || 10;
    const durabilityValue = parseInt(durability) || 10;
    const intelligenceValue = parseInt(intelligence) || 10;
    const powerValue = parseInt(power) || 10;
    const speedValue = parseInt(speed) || 10;
    const strengthValue = parseInt(strength) || 10;

    const totalPowerstats = combatValue + durabilityValue + intelligenceValue + powerValue + speedValue + strengthValue;
    const promedio = totalPowerstats / 6;

    return {
      promedio: Math.round(promedio),
      combatValue,
      durabilityValue,
      intelligenceValue,
      powerValue,
      speedValue,
      strengthValue
    }
  }
}
