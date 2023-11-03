import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasHeroeService {

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
