import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';
import { ModalDetailsComponent } from './components/modal-details/modal-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TablaHeroesComponent,
    ModalDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
