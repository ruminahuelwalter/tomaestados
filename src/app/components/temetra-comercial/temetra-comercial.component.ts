import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Papa from 'papaparse';

@Component({
  selector: 'app-temetra-comercial',
  standalone: true,
  imports: [ 
    NgIf,
    FormsModule,
  ],
  templateUrl: './temetra-comercial.component.html',
  styleUrl: './temetra-comercial.component.css'
})
export class ConvertirCvsTextoPaparseComponent {
  convertedText: string = '';
  fileName: string = '';
  defaultFileName: string = 'convertido';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        let rows: string[][] = result.data as string[][];

        // Correccion 
        // Asegurar que todas las filas tengan el mismo número de columnas
        const maxCols = Math.max(...rows.map(r => r.length));
        console.log('maxCol: ', maxCols)
        rows = rows.map(r => {
          console.log('entre')
          while (r.length < maxCols) {
            console.log('entre')
            r.push(""); // completar columnas vacías como hace Excel
          }
          return r;
        });


        // Limpieza general: trim y normalización de fechas
        rows = rows.map(cols =>
          cols.map(c => this.normalizarFechaCSV(c.trim()))
        );

        
        // Nombre generado desde columna 52 comenzando en fila 2
        const nombres = new Set<string>();
        rows.slice(1).forEach(r => {
          const valor = r[53]?.trim();
          console.log('valor: ', valor)
          if (valor) nombres.add(valor);
        });

        const nombreUnido = Array.from(nombres).join('-') || 'convertido';
        this.fileName = nombreUnido;

        // Crear texto TAB con CRLF como Excel
        this.convertedText = rows
          .map(r => r.join('\t'))
          .join('\r\n');
      }
    });
  }

  downloadTxt() {
    if (!this.convertedText) return;
    const finalName =
      (this.fileName.trim() || this.defaultFileName || 'convertido') + '.txt';

    const blob = new Blob([this.convertedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalName;
    a.click();
    window.URL.revokeObjectURL(url);
  }



  normalizarFechaCSV(valor: string): string {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/;
  const m = valor.match(regex);
  if (!m) return valor;

  let [, d, mth, y, hh, mm, ss] = m;

  // Año en 4 dígitos
  if (y.length === 2) y = '20' + y;

  // Ceros día/mes
  const dia = d.padStart(2, '0');
  const mes = mth.padStart(2, '0');

  // Si no hay hora → solo fecha
  if (!hh || !mm) {
    return `${dia}/${mes}/${y}`;
  }

  // Ceros en hora y minutos (IMPORTANTE PARA GENEXUS)
  const hora = hh.padStart(2, '0');
  const minuto = mm.padStart(2, '0');

  // Si hay segundos → conservarlos
  if (ss) {
    const segundo = ss.padStart(2, '0');
    return `${dia}/${mes}/${y} ${hora}:${minuto}:${segundo}`;
  }

  return `${dia}/${mes}/${y} ${hora}:${minuto}`;
}



}
