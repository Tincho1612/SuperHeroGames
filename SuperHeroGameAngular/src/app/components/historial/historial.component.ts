import { Component, OnInit } from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  constructor(private _data: SuperHeroApiService,
    private _dataUsers: UsersService,
    private toastr: ToastrService){}

  ngOnInit(): void {
    
  }
}
