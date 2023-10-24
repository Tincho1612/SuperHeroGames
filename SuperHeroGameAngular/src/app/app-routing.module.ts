import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';

const routes: Routes = [
  {path: 'lista', component: TablaHeroesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
