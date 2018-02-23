import { Component, OnInit } from '@angular/core';

import * as jsPDF from 'jspdf';
import { environment } from '../../environments/environment';
import { UserService } from '../-services/user.service';
import { User } from '../-interfaces/user';
import { PdfService } from '../-services/pdf.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private userService: UserService, private pdf: PdfService) { }

  doc;
  base64;
  loading = false;
  cedula = '';
  user: User = {
    nombres: 'Jhon Jhon Doe Doe',
    cedula: '00000000',
    titulo: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto'.toUpperCase(),
    otorgaciones: 'PARTICIPANTE,COMITE,ASISTENTE',
  };
  error;

  y = 0;

  ngOnInit() {
    this.generatePdf();
  }

  getUser () {
    this.loading = true;
    this.user = {
      nombres: '',
      cedula: '',
      titulo: 'Hola mundo',
      otorgaciones: ''
    };
    this.userService.getUser(this.cedula).subscribe(res => {
      this.user = res.data;
      this.generatePdf();
      this.loading = false;
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
    this.user.otorgaciones.split(',').forEach( (rol, index, array) => {
      this.setBodyPdf(rol);
      if (array[index + 1] !== undefined) {
        this.pdf.addPage();
      }
    });

    this.base64 = this.pdf.base64Pdf();
  }

  setBodyPdf (rol) {
    // Lineas
    this.pdf.doc.setDrawColor(119, 181, 255); this.pdf.doc.setLineWidth(1.5);
    this.pdf.makeLineH(20); this.pdf.makeLineH(25); this.pdf.makeLineH(20, 'bottom'); this.pdf.makeLineH(25, 'bottom');
    this.pdf.makeLineV(20); this.pdf.makeLineV(25); this.pdf.makeLineV(20, 'right'); this.pdf.makeLineV(25, 'right');

    // Imagenes
    this.pdf.doc.addImage(environment.images[0], 'JPEG', 100, 40, 70, 70);
    this.pdf.doc.addImage(environment.images[1], 'JPEG', this.pdf.doc.internal.pageSize.width - 170, 40, 70, 70);
    this.pdf.doc.addImage(environment.images[2], 'JPEG', 26, 150, 243, 302);

    // Textos
    this.pdf.doc.setFont('times new roman', 'normal'); this.pdf.doc.setFontSize(12); this.pdf.doc.setFontType('bold');
    this.pdf.centeredText('REPÚBLICA BOLIVARIANA DE VENEZUELA', this.pdf.setY(50) );
    this.pdf.centeredText('UNIVERSIDAD PEDAGÓGICA EXPERIMENTAL LIBERTADOR', this.pdf.setY(18) );
    this.pdf.centeredText('INSTITUTO DE MEJORAMIENTO PROFESIONAL DEL MAGISTERIO', this.pdf.setY(18) );
    this.pdf.centeredText('SUBDIRECCIÓN DE INVESTIGACIÓN Y POSTGRADO', this.pdf.setY(18) );

    this.pdf.doc.setFont('Arial', 'normal'); this.pdf.doc.setFontSize(45); this.pdf.doc.setFontType('bold'); this.pdf.doc.setTextColor(0, 0, 153);
    this.pdf.centeredText('CERTIFICADO', this.pdf.setY(66) );

    this.pdf.doc.setFont('Arial', 'normal'); this.pdf.doc.setFontSize(45); this.pdf.doc.setFontType('bold'); this.pdf.doc.setTextColor(0, 0, 153);

    this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('normal'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText('Que se otorga a:', this.pdf.setY(30) );

    this.pdf.doc.setFontSize(30); this.pdf.doc.setFontType('bold'); this.pdf.doc.setFontStyle('italic'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText(this.user.nombres, this.pdf.setY(40) );

    this.pdf.doc.setFontSize(18); this.pdf.doc.setFontType('normal'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.centeredText('CI: ' + this.user.cedula, this.pdf.setY(30) );

    switch (rol) {
      case 'PARTICIPANTE':
        this.pdf.centeredText('Por haber realizado la ponencia:', this.pdf.setY(30));
        this.pdf.doc.setFontSize(14); this.pdf.doc.setFontType('bold'); this.pdf.doc.setFontStyle('italic'); this.pdf.doc.setTextColor(0, 0, 0);
        this.pdf.addMultiLine(this.user.titulo, 8, this.pdf.setY(30) );
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
    this.pdf.addMultiLine('”I CONGRESO CIENTÍFICO REGIONAL. “FORMACIÓN, GESTIÓN, DIVERSIDAD, INTEGRALIDAD E INNOVACIÓN. PERSPECTIVAS, REALIDADES Y RETOS”', 7, this.pdf.setY(30) );

    this.pdf.doc.setFontSize(12); this.pdf.doc.setFontType('normal'); this.pdf.doc.setFontStyle('normal'); this.pdf.doc.setTextColor(0, 0, 0);
    this.pdf.doc.text('Ciudad Guayana, 15 de noviembre de 2017', 550, this.pdf.setY(20));

    this.pdf.y = 0;

  }

  downloadPdf () {
    this.pdf.downloadPdf();
  }

}
