import { Component } from '@angular/core';
import { NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-generar-kml',
  templateUrl: './generar-kml.component.html',
  styleUrls: ['./generar-kml.component.css'],
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    TitleCasePipe,
    NgFor,
    NgClass
  ]
})

export class GenerarKmlComponent {
  kmlData: string | null = null;
  previewData: any[] = [];
  fileName: string = 'export.kml';
  nameRoute: string = '';
  numberRoute: string = '';

  geoJsonData: any = null;
  outputFormat: 'kml' | 'geojson' = 'kml';


  displayedColumns: string[] = [
    'folio', 'nombre', 'direccion', 'socio', 'sum', 'medidor', 'latitud', 'longitud'
  ];


  onFileSelected(event: any) {
    this.clearData()
    const file: File = event.files?.[0] || event.target.files?.[0];
    if (!file) return;

    this.fileName = file.name.replace(/\.[^/.]+$/, '') + '.kml';
    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      const parsedData = this.parseData(lines);

      this.previewData = parsedData.slice(0, 5);

      if (this.outputFormat === 'kml') {
        this.kmlData = this.convertToKML(parsedData);
        this.geoJsonData = null;
      } else {
        this.geoJsonData = this.convertToGeoJSON(parsedData);
        this.kmlData = null;
      }
    };


    reader.readAsText(file);
  }

  parseData(lines: string[]) {
    const data: any[] = [];
    for (let line of lines) {
      const cols = line.split('\t');
      if (cols.length < 18) continue;
      if (this.nameRoute === ''){
        this.numberRoute = cols[0]?.trim();
        this.nameRoute = 'Ruta-' + this.numberRoute;
      }

      data.push({
        folio: cols[1]?.trim(),
        nombre: cols[2]?.trim(),
        direccion: cols[3]?.trim(),
        socio: cols[4]?.trim(),
        sum: cols[5]?.trim(),
        medidor: cols[6]?.trim(),
        latitud: cols[16]?.trim(),
        longitud: cols[17]?.trim()
      });
    }
    return data;
  }

  convertToKML(data: any[]): string {
    let placemarks = '';

    for (const row of data) {
      if (!row.latitud || !row.longitud) continue;

      const descripcion = `
        Folio: ${row.folio}<br/>
        Dirección: ${row.direccion}<br/>
        Socio: ${row.socio}<br/>
        Suministro: ${row.sum}<br/>
        Medidor: ${row.medidor}
      `;

      placemarks += `
        <Placemark>
          <name>${row.nombre}</name>
          <description><![CDATA[${descripcion}]]></description>
          <Point>
            <coordinates>${row.longitud},${row.latitud},0</coordinates>
          </Point>
        </Placemark>
      `;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
      <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>
          <name>${this.nameRoute}</name>
          ${placemarks}
        </Document>
      </kml>`;
  }

  convertToGeoJSON(data: any[]) {
    const features = [];

    for (const row of data) {
      if (!row.latitud || !row.longitud) continue;

      features.push({
        type: 'Feature',
        properties: {
          folio: row.folio,
          nombre: row.nombre,
          direccion: row.direccion,
          socio: row.socio,
          suministro: row.sum,
          medidor: row.medidor,
          ruta: this.nameRoute
        },
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(row.longitud),
            parseFloat(row.latitud)
          ]
        }
      });
    }

    return {
      type: 'FeatureCollection',
      name: this.nameRoute,
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326'
        }
      },
      features
    };
}


  downloadKML() {
    if (!this.kmlData) return;
    const blob = new Blob([this.kmlData], { type: 'application/vnd.google-earth.kml+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    
    
  }

  downloadGeoJSON() {
    if (!this.geoJsonData) return;

      const blob = new Blob(
      [JSON.stringify(this.geoJsonData, null, 2)],
      { type: 'application/geo+json' }
    );

      const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName.replace('.kml', '.geojson');
    a.click();
    window.URL.revokeObjectURL(url);
  }


    download() {
      if (this.outputFormat === 'kml' && this.kmlData) {
        this.downloadKML();
      }
    
      if (this.outputFormat === 'geojson' && this.geoJsonData) {
        this.downloadGeoJSON();
      }
    }


    clearData() {
      this.kmlData = null;
      this.geoJsonData = null;
      this.previewData = [];
      this.nameRoute = '';
      this.numberRoute = '';
    }

}
