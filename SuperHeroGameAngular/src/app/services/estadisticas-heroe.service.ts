import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasHeroeService {

  getEstadisticasHeroe(heroe: any) {
    const { combat, durability, intelligence, power, speed, strength } = heroe.powerstats;

    const combatValue = parseInt(combat) || 5;
    const durabilityValue = parseInt(durability) || 5;
    const intelligenceValue = parseInt(intelligence) || 5;
    const powerValue = parseInt(power) || 5;
    const speedValue = parseInt(speed) || 5;
    const strengthValue = parseInt(strength) || 5;

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
