import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AboutComponent } from './about/about.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AuthenticationModule
  ],
  exports: [
    WelcomeComponent
  ],
  declarations: [WelcomeComponent, AboutComponent]
})
export class CoreModule { }
