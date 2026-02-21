import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
  
})
export class InicioComponent implements OnInit {

  mostrarOpciones = false;
  fondoColor = '#000000'; // Color de fondo inicial
  transitionClass = false;
  colorText = true;
  ocultarOpciones = false;
  textoInicio = "Bienvenido a Super Hero Game";

  // Obtén una referencia al elemento de fondo para añadir/quitar la clase
  @ViewChild('backgroundElement') backgroundElement!: ElementRef;

  constructor(
    private router: Router,
    private serviceUser: UsersService
  ) { }

  ngOnInit() {
  this.serviceUser.warmUp().subscribe({
    next: (res) => {
      console.log("✅ Confirmación recibida:", res); 
    },
    error: (err) => {
      console.warn("⏳ Señal de encendido enviada. La DB está procesando el arranque.");
    }
  });
  }

  mostrarColumnas() {
    this.mostrarOpciones = true;
  }

  cambiarOpciones() {
    this.colorText = false;
    this.ocultarOpciones = true;
    this.fondoColor = '#ffffff';
    this.aplicarTransicion();
  }

  irALogin() {
    // Cambia el color de fondo y redirige a la página de login
    this.cambiarOpciones();
    this.textoInicio = "Redireccionando al inicio de sesión..."
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  irARegistro() {
    // Cambia el color de fondo y redirige a la página de registro
    this.cambiarOpciones();
    this.textoInicio = "Redireccionando al registro..."
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 1000);
  }

  aplicarTransicion() {
    // Agrega la clase de transición y elimínala después de 1 segundo
    this.transitionClass = true
    setTimeout(() => {
      this.transitionClass = false;
    }, 1000);
  }
}
