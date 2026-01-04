import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavBarComponent {

  currentRoute = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects;
      });
  }

  get navClass(): string {
    if (this.currentRoute.startsWith('/discar')) return 'bg-[#003366]';
    if (this.currentRoute.startsWith('/temetra')) return 'bg-[#286574]';
    if (this.currentRoute.startsWith('/mapa')) return 'bg-[#006C35]';
    return 'bg-[#55926D]'; // home
  }
}
