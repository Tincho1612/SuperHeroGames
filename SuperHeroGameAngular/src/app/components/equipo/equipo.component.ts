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

  equipo: Heroe[]
  idHeroeActual: number = 0;
  modal: boolean = false;
  loading: boolean = false;


  constructor(private _userData: UsersService,private _data:SuperHeroApiService,
    private toast: ToastrService) {
    this.equipo = []
    
    
  }
  accionesEquipos = [
    { label: 'Información detallada', funcion: (heroe: Heroe) => this.abrirModal(heroe.id)},
    { label: 'Agregar a favoritos', funcion: (heroe: Heroe) => this.cargarFavorito(heroe.id)}]

  ngOnInit(): void {
    this.cargarEquipos()
  }

  cargarFavorito(idHeroe: string) {
    const dato = Number(idHeroe);
    this._userData.agregarFavoritoUser(dato).subscribe((data)=>{
      this.toast.success("favoritos","Se añadio a favoritos correctamente")
    })
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  cargarEquipos(){
    this._userData.getEquipoTest().subscribe((data)=>{
      data.listaEquipo.forEach((Element: Number)=>{
        this.cargarheroe(Element)
      })
      
    })
  }

  cargarheroe(id:Number){
    this._data.getHeroe(Number(id)).subscribe((data)=>{
      this.equipo.push(data)
      
    })
  }
}
