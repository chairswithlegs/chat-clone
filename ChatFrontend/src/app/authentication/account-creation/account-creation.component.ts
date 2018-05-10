import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';

@Component({
	selector: 'app-account-creation',
	templateUrl: './account-creation.component.html',
	styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent {

	@Input() successRedirect: any[];

	constructor(private auth: AuthStateService, private router: Router) { }

	createAccount(username: String, password: String) {
		this.auth.createAccount(username, password)
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
