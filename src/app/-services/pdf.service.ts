import { Injectable } from '@angular/core';

import * as jsPDF from 'jspdf';
import { Signatory } from '../-interfaces/signatory';

@Injectable()
export class PdfService {

  doc = null;
  y = 0;

  constructor() { }

  newPdf () {
    this.doc = new jsPDF('l', 'pt');
  }

  addPage () {
    this.doc.addPage();
  }

  base64Pdf () {
    return this.doc.output('dataurlstring');
  }

  downloadPdf () {
    this.doc.save('certificado.pdf');
  }

  setY (y?) {
    this.y = this.y + y;
    return this.y;
  }

  centeredText (text, y) {
    const textWidth = this.doc.getStringUnitWidth(text) * this.doc.internal.getFontSize() / this.doc.internal.scaleFactor;
    const textOffset = (this.doc.internal.pageSize.width - textWidth) / 2;
    this.doc.text(textOffset, y, text);
  }

  addMultiLine (str, p, y) {
    const arr = this.chunkString(str, p);
    arr.forEach( (element, index) => {
      if (index > 0) {
        this.setY(20);
      }
      this.centeredText(element, this.y);
    });
  }

  makeLineH (y, position?) {
    const start = (this.doc.internal.pageSize.width + 10) - this.doc.internal.pageSize.width;
    const end = this.doc.internal.pageSize.width - 10;

    let h;

    if (position === 'bottom') {
      h = this.doc.internal.pageSize.height - y;
    } else {
      h = (this.doc.internal.pageSize.height + y) - this.doc.internal.pageSize.height;
    }

    this.doc.line(start, h, end, h);
  }

  makeLineV (x, position?) {
    const start = (this.doc.internal.pageSize.height + 10) - this.doc.internal.pageSize.height;
    const end = this.doc.internal.pageSize.height - 10;

    let w;

    if (position === 'right') {
      w = this.doc.internal.pageSize.width - x;
    } else {
      w = (this.doc.internal.pageSize.width + x) - this.doc.internal.pageSize.width;
    }

    this.doc.line(w, start, w , end);
  }

  chunkString(str, p) {
    let splited = str.split(' ');

    const array = [];

    let len = splited.length;

    while (len) {
      let joinstr = '';

      if (splited.length > p) {
        for (let index = 0; index < p; index++) {
          joinstr = joinstr + splited[index] + ' ';
          splited[index] = null;

        }
      } else {
        for (let index = 0; index < splited.length; index++) {
          joinstr = joinstr + splited[index] + ' ';
          splited[index] = null;
        }
      }

      splited = splited.filter( item => {
        if (item !== null) {
          return item;
        }
      });

      len = splited.length;

      array.push(joinstr);
  }
    return array;
  }

  addSignatories(signatories: Array<Signatory>) {
    this.doc.setDrawColor(0, 0, 0); this.doc.setLineWidth(1.5);
    const columns = (this.doc.internal.pageSize.width - 50) / signatories.length;
    let i = 25;
    signatories.forEach((el, index) => {
      i = i + columns;
      const start = (i - (columns / 2)) - 100;
      const end = (i - (columns / 2)) + 100;
      this.doc.line(start, this.y , end, this.y);
    });
    i = 25;
    this.setY(20);
    this.doc.setFontType('bold');
    signatories.forEach((el, index) => {
      i = i + columns;
      const textWidth = this.doc.getStringUnitWidth(el.nombres) * this.doc.internal.getFontSize() / this.doc.internal.scaleFactor;
      const textOffset = (i - (columns / 2)) - textWidth / 2;
      console.log([i, textWidth, textOffset]);
      this.doc.text(textOffset, this.y, el.nombres);
    });

    i = 25;
    this.setY(15);
    this.doc.setFontType('normal');
    signatories.forEach((el, index) => {
      i = i + columns;
      const textWidth = this.doc.getStringUnitWidth(el.titulo) * this.doc.internal.getFontSize() / this.doc.internal.scaleFactor;
      const textOffset = (i - (columns / 2)) - textWidth / 2;
      console.log([i, textWidth, textOffset]);
      this.doc.text(textOffset, this.y, el.titulo);
    });
  }

}
