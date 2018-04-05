import { Component } from '@angular/core';

@Component({
	selector: 'app-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
	formView = 'login';
	
	showForm(formName) {
		this.formView = formName;
	}
}
