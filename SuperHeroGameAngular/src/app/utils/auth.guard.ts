
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../services/users.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

  //Inject de dependecias
  const router: Router = inject(Router);
  const toastr: ToastrService = inject(ToastrService);
  const _userService:  UsersService = inject(UsersService);
  //
  const token = localStorage.getItem('token');

  if (token == undefined) {
    router.navigate(['/login']);
    toastr.error('Tenés que estar logeado para ingresar', 'Error');
    return false;
  } else {
    return true;
  }
};
