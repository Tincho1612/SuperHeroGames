import { Component, ElementRef, Input, OnInit, ViewChild, numberAttribute} from '@angular/core';
import { SuperHeroApiService } from 'src/app/services/super-hero-api.service';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.css']
})
export class ModalDetailsComponent implements OnInit{

  heroeActual: any;

  constructor(private _serviceHeroe: SuperHeroApiService){
  }

  @ViewChild('myModal')
  modalElement!: ElementRef;

  @Input({required: true, transform:  numberAttribute}) id!: number;

  ngOnInit(): void {
    this.getHeroeModal();
  }

  cerrarModal() {
    this.modalElement.nativeElement.style.display = 'none';
  }

  getHeroeModal(){
    this._serviceHeroe.getHeroe(this.id).subscribe((data)=>{
      this.heroeActual = data;
      console.log(this.heroeActual);
    });
  }

}
