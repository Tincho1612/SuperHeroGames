import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActiveNavbarService } from 'src/app/services/active-navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  activo = true;
  private subscription: Subscription;

  searchQuery: string = '';
  shouldShowNavbar: boolean = true;

  isConfirmed: boolean = false;

  constructor(
    private router: Router,
    private _navbar: ActiveNavbarService,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.shouldShowNavbar = true;
        const currentRoute = this.router.routerState.snapshot.url;
        const routes = ['/login', '/register', '/recuperarpassword', '/resetpassword', '/inicio', '/confirmemail'];
        for (const route of routes) {
          if (currentRoute.startsWith(route)) {
            this.shouldShowNavbar = false;
            break;
          }
        }
      }
    });

    this.subscription = this._navbar.desactivarComponente$.subscribe(() => {
      this.slideTransition(false);
    });

    this.subscription.add(this._navbar.reactivarComponente$.subscribe(() => {
      this.slideTransition(true);
    }));
  }

  ngOnInit(): void {
    this._navbar.componenteActivo$.subscribe((estado: boolean) => {
      this.isConfirmed = estado;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.router.navigate([`/lista/${this.searchQuery}`]);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/inicio']);
  }

  private slideTransition(isActive: boolean) {
    this.activo = isActive;

    if (isActive) {
      this.renderer.removeClass(this.el.nativeElement, 'slide-up');
      this.renderer.addClass(this.el.nativeElement, 'slide-down');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'slide-down');
      this.renderer.addClass(this.el.nativeElement, 'slide-up');
    }
  }
}
