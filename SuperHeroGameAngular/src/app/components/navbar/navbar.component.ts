import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActiveNavbarService } from 'src/app/services/active-navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  activo = true;
  private subscription: Subscription;

  searchQuery: string = '';
  shouldShowNavbar: boolean = true;

  constructor(
    private router: Router,
    private _navbar: ActiveNavbarService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.routerState.snapshot.url;
        this.shouldShowNavbar = !['/login', '/register'].includes(currentRoute);
      }
    });

    this.subscription = this._navbar.desactivarComponente$.subscribe(() => {
      this.slideTransition(false);
    });

    this.subscription.add(this._navbar.reactivarComponente$.subscribe(() => {
      this.slideTransition(true);
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search() {
    this.router.navigate([`/lista/${this.searchQuery}`]);
  }

  logout() {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
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
