import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AuthStateService } from './auth-state.service';

class MockHttpClient {

}

describe('AuthStateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthStateService,
				{ provide: HttpClient, useClass: MockHttpClient }
			]
		});
	});

	it('should be created', inject([AuthStateService], (service: AuthStateService) => {
		expect(service).toBeTruthy();
	}));
});
