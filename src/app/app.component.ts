import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiscarComercialComponent } from "./components/discar-comercial/discar-comercial.component";
import { ConvertirCvsTextoPaparseComponent } from "./components/temetra-comercial/temetra-comercial.component";
import { GenerarKmlComponent } from "./components/generar-kml/generar-kml.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DiscarComercialComponent, ConvertirCvsTextoPaparseComponent, GenerarKmlComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tomaestadosweb';
}
