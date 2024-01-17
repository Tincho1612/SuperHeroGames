import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { Heroe } from 'src/app/interfaces/Heroe';
import { Pelea } from 'src/app/interfaces/pelea';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit, OnDestroy {

  modal: boolean = false;
  loading: boolean = false;
  idHeroeActual: number = 0;

  historial: Pelea[] = [];

  peleas: Pelea[] = [];
  @Output() historialActualizado = new EventEmitter<Heroe[]>();

  // Array para almacenar los detalles de los héroes en cada pelea
  detallesHeroes: any[] = [];

  private ngUnsubscribe = new Subject<void>();

  constructor(private superHeroApiService: SuperHeroApiService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cargarHistorial(): void {
    this.loading = true;
    this.peleas = this.usersService.currentUser.historial;

    const heroesDetailsObservables = this.peleas.map(pelea => {
      const observable1 = this.superHeroApiService.getHeroe(pelea.idHeroe1);
      const observable2 = this.superHeroApiService.getHeroe(pelea.idHeroe2);
      const observable3 = this.superHeroApiService.getHeroe(pelea.idGanador);

      return forkJoin([observable1, observable2, observable3]).pipe(
        map(([heroe1, heroe2, ganador]: [Heroe, Heroe, Heroe]) => ({ heroe1, heroe2, ganador, fecha: pelea.fechaPelea }))
      );
    });

    forkJoin(heroesDetailsObservables)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(error => {
          // Manejar errores aquí
          console.error('Error fetching heroes details:', error);
          return [];
        })
      )
      .subscribe(detallesHeroes => {
        this.detallesHeroes = detallesHeroes;
        this.loading = false;
        this.historialActualizado.emit(this.detallesHeroes);
      });
  }

}
