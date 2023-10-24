import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.css']
})
export class ModalDetailsComponent {
  
  @ViewChild('myModal', { static: false }) modalElement: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {
    this.modalElement.nativeElement.style.display = 'none';
  }

  abrirModal() {
    this.modalElement.nativeElement.style.display = 'block';
  }

  cerrarModal() {
    this.modalElement.nativeElement.style.display = 'none';
  }
}
