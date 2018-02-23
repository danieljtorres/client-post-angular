import { NgModule } from '@angular/core';

import { RouterModule, Routes,  } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './pdf/pdf.module#PdfModule', data: { preload: true } },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
