import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { authGuard } from './utils/auth.guard';

const routes: Routes = [
  { path: 'lista/:heroe', component: TablaHeroesComponent, canActivate: [authGuard] },
  { path: 'lista', component: TablaHeroesComponent, canActivate: [authGuard] },
  { path: 'register', component: FormRegisterComponent },
  { path: 'login', component: FormLoginComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
