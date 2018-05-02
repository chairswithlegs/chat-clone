import { Component } from '@angular/core';
import { AuthStateService } from './authentication/auth-state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private auth: AuthStateService) {}

	logout() {
		this.auth.logout();
	}
}
