import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { FormLoginComponent } from './components/form-login/form-login.component';

const routes: Routes = [
  {path: 'lista/:heroe', component: TablaHeroesComponent},
  {path: 'lista', component: TablaHeroesComponent},
  {path:'register',component: FormRegisterComponent},
  {path:'login',component: FormLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
