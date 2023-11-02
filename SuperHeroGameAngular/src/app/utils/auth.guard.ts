
import { Inject, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  //Inject de dependecias
  const router: Router = inject(Router);
  const toastr: ToastrService = inject(ToastrService);

  //
  const usuarioActual = localStorage.getItem('usuarioActual');

  if (usuarioActual == undefined) {
    router.navigate(['/login']);
    toastr.error('Tenés que estar logeado para ingresar', 'Error');
    return false;

  } else {

    return true;
  }
};
