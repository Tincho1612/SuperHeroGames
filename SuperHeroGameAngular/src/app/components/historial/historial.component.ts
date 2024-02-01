import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { forkJoin, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { Heroe } from 'src/app/interfaces/Heroe';
import { Pelea } from 'src/app/interfaces/pelea';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private _serviceHeroe: SuperHeroApiService,
    private _serviceUser: UsersService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cargarHistorialTest();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  cargarHistorialTest() {
    this.loading = true;
    this._serviceUser.getPeleasUser().subscribe({
      next: (data) => {
        this.peleas = data.historialCompleto

        const heroesDetailsObservables = this.peleas.map(pelea => {
          const heroe1 = this._serviceHeroe.getHeroe(pelea.idHeroe1);
          const heroe2 = this._serviceHeroe.getHeroe(pelea.idHeroe2);
          const ganador = this._serviceHeroe.getHeroe(pelea.idGanador);

          return forkJoin([heroe1, heroe2, ganador]).pipe(
            map(([heroe1, heroe2, ganador]: [Heroe, Heroe, Heroe]) => ({ heroe1, heroe2, ganador, fecha: pelea.fechaPelea }))
          );
        });

        forkJoin(heroesDetailsObservables)
          .pipe(
            takeUntil(this.ngUnsubscribe),
            catchError(error => {
              console.error(error);
              return [];
            })
          )
          .subscribe(detallesHeroes => {
            this.detallesHeroes = detallesHeroes;
            this.historialActualizado.emit(this.detallesHeroes);
            this.loading = false;
          });
      },
      error: (e) => {
        this.loading = false;
        console.log(e);
        if (e.status === 429) {
          this.toastr.error(e.error, 'Error');
        } else {
          this.toastr.error(e.error.message, 'Error');
        }
      }
    })
  }

}
