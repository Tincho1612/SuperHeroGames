import { Component, Input, numberAttribute } from '@angular/core';
import { Heroe } from 'src/app/interfaces/Heroe';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-item-favorito',
  templateUrl: './item-favorito.component.html',
  styleUrls: ['./item-favorito.component.css']
})

export class ItemFavoritoComponent {
  loading: boolean = false;
  heroeActual:any
  constructor(private _ServiceHeroe:SuperHeroApiService ){

  }
  @Input({ required: true, transform: numberAttribute }) id!: number;

  getHeroeItem() {
    this.loading = true;
    this._ServiceHeroe.getHeroe(this.id).subscribe((data) => {
      this.heroeActual = data;
      this.loading = false;
    });
  }
}
