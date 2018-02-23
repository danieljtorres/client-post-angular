import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdfRoutingModule } from './pdf-routing.module';
import { IndexComponent } from './index.component';
import { SafePipe } from '../-pipes/safe.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    PdfRoutingModule,
    FormsModule
  ],
  declarations: [IndexComponent,SafePipe]
})
export class PdfModule { }
