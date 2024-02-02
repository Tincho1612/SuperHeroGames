import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  mostrarOpciones = false;
  
  constructor(
    private router: Router
  ){}

  mostrarColumnas() {
    this.mostrarOpciones = true;
  }

  irALogin() {
    // Redirige a la página de login
    this.router.navigate(['/login']);
  }

  irARegistro() {
    // Redirige a la página de registro
    this.router.navigate(['/register']);
  }
}
