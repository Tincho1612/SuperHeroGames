import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  searchQuery: string = '';
  shouldShowNavbar: boolean = true;

  constructor(private router: Router) { 
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.snapshot.url;
        this.shouldShowNavbar = !['/login', '/register'].includes(currentRoute);
      }
    });
   }

  search() {
    this.router.navigate([`/lista/${this.searchQuery}`]);
  }

  logout(){
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }
}
