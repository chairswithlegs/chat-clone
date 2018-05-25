import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountCreationComponent } from './account-creation.component';
import { AuthStateService } from '../auth-state.service';
import { Observable } from 'rxjs/Observable';

class MockAuthStateService {
	createAccount(username: String, password: String) {
		if (username === 'test' && password === 'test') {
			return Observable.of(true);
		} else {
			return Observable.of(false);
		}
	}
}

describe('AccountCreationComponent', () => {
	let component: AccountCreationComponent;
	let fixture: ComponentFixture<AccountCreationComponent>;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			declarations: [ AccountCreationComponent ],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [{ provide: AuthStateService, useClass: MockAuthStateService }]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AccountCreationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		router = TestBed.get(Router);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should create an account and redirect if successful', () => {
		let spy = spyOn(router, 'navigate');

		//It should not navigate with if the account creation fails
		component.createAccount('bad test', 'bad test');
		fixture.detectChanges();
		expect(spy).not.toHaveBeenCalled();

		//It should not navigate if no redirect is provided
		component.createAccount('test', 'test');
		fixture.detectChanges();
		expect(spy).not.toHaveBeenCalled();

		//It should navigate if redirect is provided
		component.successRedirect = ['redirect'];
		component.createAccount('test', 'test');
		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
	});
});
