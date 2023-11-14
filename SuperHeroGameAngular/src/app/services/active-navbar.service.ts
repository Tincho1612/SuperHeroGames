import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveNavbarService {
  desactivarComponente$ = new Subject<void>();
  reactivarComponente$ = new Subject<void>();

  desactivarComponente() {
    this.desactivarComponente$.next();
  }

  reactivarComponente() {
    this.reactivarComponente$.next();
  }
}
