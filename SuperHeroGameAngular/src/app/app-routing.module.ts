import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { authGuard } from './utils/auth.guard';
import { RuletaComponent } from './components/ruleta/ruleta.component';
import { EquipoComponent } from './components/equipo/equipo.component';
import { HistorialComponent } from './components/historial/historial.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'register', component: FormRegisterComponent },
  { path: 'login', component: FormLoginComponent },
  { path: 'confirmemail/:token', component: ConfirmEmailComponent },
  { path: 'recuperarpassword', component: RecoverPasswordComponent },
  { path: 'resetpassword/:token', component: ResetPasswordComponent },
  { path: 'lista/:heroe', component: TablaHeroesComponent, canActivate: [authGuard] },
  { path: 'lista', component: TablaHeroesComponent, canActivate: [authGuard] },
  { path: 'favoritos', component: FavoritosComponent, canActivate: [authGuard] },
  { path: 'ruleta', component: RuletaComponent, canActivate: [authGuard] },
  { path: 'misEquipos', component: EquipoComponent, canActivate: [authGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [authGuard] },
  { path: 'updateUser', component: UpdateUserComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
