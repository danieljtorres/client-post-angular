import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { PdfModule } from './pdf/pdf.module';
import { AppRoutingModule } from './app-routing.module';
import { UserService } from './-services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { PdfService } from './-services/pdf.service';
import { EventService } from './-services/event.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PdfModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    PdfService,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
