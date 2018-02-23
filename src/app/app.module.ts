import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';

import { BlogModule } from './blog/blog.module';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './-guards/auth.guard';
import { AuthenticationService } from './-services/authentication.service';
import { UserService } from './-services/user.service';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MenuComponent,
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BlogModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
