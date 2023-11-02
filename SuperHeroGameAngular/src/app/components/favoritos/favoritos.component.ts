import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { Heroe } from 'src/app/interfaces/Heroe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit{
  listHeroes: Heroe[] = [];
  modal: boolean = false;
  idHeroeActual: number = 0;
  loading: boolean = false;
  favoritos: number[] = [];
  SuperheroesFav: Heroe[]=[];

  constructor(private _data:SuperHeroApiService, private _dataUsers:UsersService){

  }

  ngOnInit(): void {
    // Accede a la lista de favoritos del usuario desde el servicio
    this.favoritos = this._dataUsers.currentUser.favoritos || []; 
    this.recibirHeroesFav(this.favoritos);
  }

  recibirHeroesFav(ids: number []){
    this.SuperheroesFav=[]; ///vacio el arreglo, asi cuando elimino se sale del array y recargo todo
    ids.forEach(id => {
      this._data.getHeroe(id).subscribe((heroe )=>{ ///Hago llamados de a uno y igualo todo en el array
        this.SuperheroesFav.push(heroe);
      })
    });
  }

  abrirModal(id: string) {
    this.modal = !this.modal;
    this.idHeroeActual = Number(id);
  }

  eliminarFavorito(idHeroe:string){
    const idNumero= Number (idHeroe);
 
    this.favoritos.splice(this.favoritos.indexOf(idNumero), 1); ///elimino el dato basandome en la posicion que lo tomo con index
    this.recibirHeroesFav(this.favoritos);
    console.log (this._dataUsers.currentUser);

  }

}
