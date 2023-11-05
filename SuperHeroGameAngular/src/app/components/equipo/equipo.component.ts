import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { Equipo } from 'src/app/interfaces/Equipo';
import { Heroe } from 'src/app/interfaces/Heroe';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  equipos: Equipo[]
  accionesEquipos = [
    { label: 'Eliminar de favoritos', funcion: (heroe: Heroe) => this.eliminarDelEquipo(heroe) }];
  constructor(private _userData:UsersService,private _data:SuperHeroApiService,private toast:ToastrService){
      this.equipos= []
  }
  ngOnInit(): void {
    this.equipos = this._userData.currentUser.equipos || []; 
    
  }
  eliminarDelEquipo(Heroe:Heroe){
    this._userData.currentUser.equipos[0].heroes.splice(this._userData.currentUser.equipos[0].heroes.indexOf(Heroe), 1);
    this._userData.updateUserData(this._userData.currentUser);
    this.toast.error('El heroe fué eliminado del Equipo', 'Heroe eliminado');
  }
}
