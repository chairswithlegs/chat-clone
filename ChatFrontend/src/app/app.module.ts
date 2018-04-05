import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';

import { AuthenticationModule } from './authentication/authentication.module';

import { ChatModule } from './chat/chat.module';
import { DashboardComponent } from './chat/dashboard/dashboard.component';

import { CoreModule } from './core/core.module';
import { WelcomeComponent } from './core/welcome/welcome.component';

const routes: Route[] = [
    { path: 'dashboard', component: DashboardComponent },
    { path: '', component: WelcomeComponent },
    { path: '**', component: WelcomeComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthenticationModule,
    CoreModule,
    ChatModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
