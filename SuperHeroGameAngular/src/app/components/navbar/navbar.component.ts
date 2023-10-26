import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  searchQuery: string = '';

  constructor(private router: Router) { }

  search() {
    this.router.navigate([`/lista/${this.searchQuery}`]);
  }
}
