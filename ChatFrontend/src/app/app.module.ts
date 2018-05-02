import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';

import { AuthenticationModule } from './authentication/authentication.module';

import { ChatModule } from './chat/chat.module';
import { DashboardComponent } from './chat/dashboard/dashboard.component';

import { CoreModule } from './core/core.module';
import { WelcomeComponent } from './core/welcome/welcome.component';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { AboutComponent } from './core/about/about.component';
import { AuthGuardService } from './authentication/auth-guard.service';

const routes: Route[] = [
	{ path: 'about', component: AboutComponent },
	{ 
		path: 'dashboard', 
		component: DashboardComponent, 
		canActivate: [AuthGuardService], 
		data: { redirect: '/' }
	},
	{ path: 'chat-room/:roomId/:password', component: ChatRoomComponent },
	{ 
		path: '**',
		component: WelcomeComponent,
		canActivate: [AuthGuardService],
		data: { redirect: '/dashboard', invert: true }
	}
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
	providers: [AuthGuardService],
	bootstrap: [AppComponent]
})
export class AppModule { }
