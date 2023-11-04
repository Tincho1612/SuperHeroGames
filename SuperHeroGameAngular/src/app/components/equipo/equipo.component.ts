import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { Equipo } from 'src/app/interfaces/Equipo';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  equipos: Equipo[]
  constructor(private _userData:UsersService,private _data:SuperHeroApiService,private toast:ToastrService){
      this.equipos= []
  }
  ngOnInit(): void {
    this.equipos = this._userData.currentUser.equipos || []; 
    
  }
}
