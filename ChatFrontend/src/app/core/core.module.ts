import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';
import { AuthenticationModule } from '../authentication/authentication.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AuthenticationModule
  ],
  exports: [
    WelcomeComponent
  ],
  declarations: [WelcomeComponent]
})
export class CoreModule { }
