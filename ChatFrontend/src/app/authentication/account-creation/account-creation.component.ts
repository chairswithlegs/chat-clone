import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';

@Component({
	selector: 'app-account-creation',
	templateUrl: './account-creation.component.html',
	styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent {

	username: String;
	password: String;
	@Input() successRedirect: any[];
    errorAlert = false;

	constructor(private auth: AuthStateService, private router: Router) { }

	createAccount(username: String, password: String): void {
		this.auth.createAccount(username, password)
			.take(1)
			.subscribe((success) => {
				if (!success) {
					this.errorAlert = true;
				} else if (this.successRedirect) {
                    this.auth.login(username, password)
                    .take(1)
                    .subscribe((success) => {
                        this.router.navigate([this.successRedirect]);
                    });
				}
			});
    }
}
