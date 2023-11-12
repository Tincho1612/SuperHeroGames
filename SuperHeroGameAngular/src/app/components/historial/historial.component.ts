import { Component, OnInit, Input } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/interfaces/User';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Heroe } from 'src/app/interfaces/Heroe';
import { ToastrService } from 'ngx-toastr';
import { Pelea } from 'src/app/interfaces/pelea';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  modal: boolean = false;
  loading: boolean = false;
  idHeroeActual: number = 0;

  historial: Pelea [] = [];

  @Input() peleas: Pelea[] = [];

  // Array para almacenar los detalles de los héroes en cada pelea
  detallesHeroes: any[] = [];

  constructor(private _data: SuperHeroApiService,
    private _dataUsers: UsersService,
    private toastr: ToastrService){}


    ngOnInit(): void {
        this.loading = true;
        this.peleas=this._dataUsers.currentUser.historial;
        const observables = this._dataUsers.currentUser.historial.map(pelea => {
        const observable1 = this._data.getHeroe(pelea.idHeroe1);
        const observable2 = this._data.getHeroe(pelea.idHeroe2);
        const observable3=this._data.getHeroe(pelea.ganador);
    
        return forkJoin([observable1, observable2, observable3]).pipe(
          map(([heroe1, heroe2, ganador]: [Heroe, Heroe, Heroe]) => ({ heroe1, heroe2, ganador, fecha: pelea.fecha }))
        );
      });
    
      forkJoin(observables).subscribe(detallesHeroes => {
        this.detallesHeroes = detallesHeroes;
        this.loading = false;
      });

      
    }
    
    
  }

