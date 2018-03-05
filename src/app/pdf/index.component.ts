import { Component, OnInit } from '@angular/core';

import * as jsPDF from 'jspdf';
import { UserService } from '../-services/user.service';
import { User } from '../-interfaces/user';
import { Event } from '../-interfaces/event';
import { PdfService } from '../-services/pdf.service';
import { EventService } from '../-services/event.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private userService: UserService, private eventService: EventService, private pdf: PdfService) { }

  base64;
  loading = false;

  cedula = '';
  code = '';

  events: Array<Event> = [];


  user = this.userService.user;
  event = this.eventService.evento;

  error;

  y = 0;

  ngOnInit() {
    this.getEvents();
    this.generatePdf();
  }

  getEvents() {
    this.eventService.getEvents().subscribe(res => {
      this.events = res;
      this.code = res[0].codigo;
    });
  }

  getInformation() {
    this.loading = true;

    this.user = this.user;

    this.userService.getInformation(this.cedula, this.code).subscribe(res => {

      this.user = res;
      console.log(this.user);
      this.events.forEach( el => {
        if (el.codigo === this.code) {
          this.event = el;
        }
      });
      this.loading = false;

      this.generatePdf();

    }, err => {

      if (err.status === 404) {
        this.error = {
          status: '404',
          msg: 'La cedula no se encuentra o es incorrecta, verifique y vuelva a intentar',
        };

      } else if (err.status === 500) {

        this.error = {
          status: '500',
          msg: 'Hubo un problema al intentar buscar sus datos, recargue la pagina e intente de nuevo',
        };

      }

      this.loading = false;
    });
  }

  generatePdf () {
    this.pdf.newPdf();
    this.user.roles.forEach( (rol, index, array) => {
      this.setBodyPdf(rol);
      if (array[index + 1] !== undefined) {
        this.pdf.addPage();
      }
      if (array[index + 1] === undefined && this.user.actividades.length) {
        this.pdf.addPage();
      }
    });

    this.user.actividades.forEach( (actividad, index, array) => {
      this.setBodyPdf('PARTICIPANTE', actividad);
      if (array[index + 1] !== undefined) {
        this.pdf.addPage();
      }
    });

    this.base64 = this.pdf.base64Pdf();
  }

  setBodyPdf (rol, actividad?) {
    // Lineas
    this.pdf.doc.setDrawColor(119, 181, 255); this.pdf.doc.setLineWidth(1.5);
    this.pdf.makeLineH(20); this.pdf.makeLineH(25); this.pdf.makeLineH(20, 'bottom'); this.pdf.makeLineH(25, 'bottom');
    this.pdf.makeLineV(20); this.pdf.makeLineV(25); this.pdf.makeLineV(20, 'right'); this.pdf.makeLineV(25, 'right');

    // Imagenes
    this.pdf.doc.addImage(this.event.logo_1, 'JPEG', 100, 40, 70, 70);
    this.pdf.doc.addImage(this.event.logo_2, 'JPEG', this.pdf.doc.internal.pageSize.width - 170, 40, 70, 70);
    this.pdf.doc.addImage(this.event.fondo, 'JPEG', 26, 150, 243, 302);

    // Textos
    this.pdf.doc.setFont('times new roman', 'normal'); this.pdf.doc.setFontSize(12); this.pdf.doc.setFontType('bold');

    const encabezados = this.event.encabezado.split('#$');
    encabezados.forEach( (el, index) => {
      if (index === 0) {
        this.pdf.centeredText(el, this.pdf.setY(50) );
      } else {
        this.pdf.centeredText(el, this.pdf.setY(18) );
      }
    });

    if (rol === 'COMITE' || rol === 'ASISTENTE') {
      this.pdf.setY(85);
    }

    this.pdf.doc.setFont('Arial', 'normal'); this.pdf.doc.setFontSize(45); this.pdf.doc.setFontType('bold'); this.pdf.doc.setTextColor(0, 0, 153);
    this.pdf.centeredText('CERTIFICADO', this.pdf.setY(46) );

    this.pdf.doc.setFont('Arial', 'normal'); this.pdf.doc.setFontSize(45); this.pdf.doc.setFontType('bold'); this.pdf.doc.setTextColor(0, 0, 153);

    this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('normal'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText('Que se otorga a:', this.pdf.setY(30) );

    this.pdf.doc.setFontSize(30); this.pdf.doc.setFontType('bold'); this.pdf.doc.setFontStyle('italic'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText(this.user.nombres, this.pdf.setY(40) );

    this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('normal'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText('CI: ' + this.user.cedula, this.pdf.setY(30) );

    switch (rol) {
      case 'PARTICIPANTE':
        const por = actividad.tipo === 'PONENCIA' ? `Por haber realizado la ${actividad.tipo.toLowerCase()}:` : `Por haber realizado el ${actividad.tipo.toLowerCase()}:`;
        this.pdf.centeredText(por, this.pdf.setY(30));
        this.pdf.doc.setFontSize(14); this.pdf.doc.setFontType('bold'); this.pdf.doc.setFontStyle('italic'); this.pdf.doc.setTextColor(0, 0, 0);
        this.pdf.addMultiLine(actividad.nombre, 8, this.pdf.setY(30) );
        this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('normal'); this.pdf.doc.setFontStyle('normal'); this.pdf.doc.setTextColor(0, 0, 0);
        this.pdf.centeredText(', en el:', this.pdf.setY(30) );
        break;
      case 'COMITE':
        this.pdf.centeredText('Por formar parte del Comité Organizador del:', this.pdf.setY(30) );
        break;
      case 'ASISTENTE':
        this.pdf.centeredText('Por la asistencia al:', this.pdf.setY(30) );
        break;
      default:
        break;
    }

    this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('bold'); this.pdf.doc.setFontStyle('normal'); this.pdf.doc.setTextColor(0, 51, 204);
    this.pdf.addMultiLine(this.event.nombre, 7, this.pdf.setY(30) );

    this.pdf.doc.setFontSize(12); this.pdf.doc.setFontType('normal'); this.pdf.doc.setFontStyle('normal'); this.pdf.doc.setTextColor(0, 0, 0);

    const fin = this.event.fin !== null ? 'al' + this.event.fin + ' de' : 'de';
    const fecha = `${this.event.lugar}, ${this.event.inicio} ${fin} ${this.event.mes.toLowerCase()} de ${this.event.ano}`;
    this.pdf.doc.text(fecha, 550, this.pdf.setY(20));

    this.pdf.setY(70);
    this.pdf.addSignatories(this.event.firmantes);

    this.pdf.y = 0;

  }

  downloadPdf () {
    this.pdf.downloadPdf();
  }

}
