import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

//Modulos

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Componentes

import { TablaHeroesComponent } from './components/tabla-heroes/tabla-heroes.component';
import { ModalDetailsComponent } from './components/modal-details/modal-details.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { FormLoginComponent } from './components/form-login/form-login.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { RuletaComponent } from './components/ruleta/ruleta.component';
import { EquipoComponent } from './components/equipo/equipo.component';
import { ListaHeroesComponent } from './components/lista-heroes/lista-heroes.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CardRuletaComponent } from './components/card-ruleta/card-ruleta.component';
import { HistorialComponent } from './components/historial/historial.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component'


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TablaHeroesComponent,
    ModalDetailsComponent,
    SpinnerComponent,
    FormRegisterComponent,
    FormLoginComponent,
    FavoritosComponent,
    RuletaComponent,
    EquipoComponent,
    ListaHeroesComponent,
    CardRuletaComponent,
    HistorialComponent,
    UpdateUserComponent,
    RecoverPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required animations module
    DragDropModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
