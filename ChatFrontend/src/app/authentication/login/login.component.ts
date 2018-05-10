import { Component, Input } from '@angular/core';
import { AuthStateService } from '../auth-state.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {

	@Input() successRedirect: any[];

	constructor(private auth: AuthStateService, private router: Router) { }

	login(username: String, password: String) {
		this.auth.login(username, password)
		.take(1)
		.subscribe((success) => {
			if (!success) {
				console.log('Log in failed');
			} else if (this.successRedirect) {
				this.router.navigate([this.successRedirect]);
			}
		});
	}
}
