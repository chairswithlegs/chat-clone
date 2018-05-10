import { TestBed, inject } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthStateService } from './auth-state.service';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthStateService {

}

describe('AuthGuardService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			providers: [
				AuthGuardService,
				{ provide: AuthStateService, useClass: MockAuthStateService }
			],
		});
	});

	it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
		expect(service).toBeTruthy();
	}));
});
