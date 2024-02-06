import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveNavbarService {
  desactivarComponente$ = new Subject<void>();
  reactivarComponente$ = new Subject<void>();
  private componenteActivoSubject = new BehaviorSubject<boolean>(true);

  componenteActivo$ = this.componenteActivoSubject.asObservable();

  desactivarComponente() {
    this.desactivarComponente$.next();
  }

  reactivarComponente() {
    this.reactivarComponente$.next();
  }

  cambiarEstadoComponente(estado: boolean) {
    this.componenteActivoSubject.next(estado);
  }
}
