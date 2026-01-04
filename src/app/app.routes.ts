import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiscarComercialComponent } from './components/discar-comercial/discar-comercial.component';
import { TemetraComercialComponent } from './components/temetra-comercial/temetra-comercial.component';
import { GenerarKmlComponent } from './components/generar-kml/generar-kml.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'discar', component: DiscarComercialComponent },
  { path: 'temetra', component: TemetraComercialComponent },
  { path: 'mapa', component: GenerarKmlComponent },
  { path: '**', redirectTo: '' }
];
