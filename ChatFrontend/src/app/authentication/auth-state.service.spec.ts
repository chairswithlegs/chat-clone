import { TestBed, inject, } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthStateService } from './auth-state.service';
import { Observable } from 'rxjs/Observable';

class MockHttpClient {
	post(url: String, body: any) {
		if(body.password === 'badPass') {
			return Observable.of(false);
		} else {
			return Observable.of({ token: '1234' });
		}
	}

	get(url: String) {
		return Observable.of(true);
	}
}

describe('AuthStateService', () => {
	let localStorage;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthStateService,
				{ provide: HttpClient, useClass: MockHttpClient }
			]
		});

		localStorage = {
			item: '',
			getItem: () => this.item,
			setItem: (item) => this.item = item
		}
	});

	it('should be created', inject([AuthStateService], (service: AuthStateService) => {
		expect(service).toBeTruthy();
	}));

	it('should log the user in', inject([AuthStateService], (service: AuthStateService) => {
		//Fail the login with bad credentials
		service.login('', 'badPass')
		.take(1)
		.subscribe((success) => expect(success).toBeFalsy());
		
		//Make the login succeed with good credentials
		service.login('', 'pass')
		.take(1)
		.subscribe((success) => expect(success).toBeTruthy());
	}));
});
