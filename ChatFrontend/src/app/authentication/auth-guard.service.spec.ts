import { TestBed, inject } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { AuthStateService } from './auth-state.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

class MockAuthStateService {
	authState = Observable.of(true);

	setAuthState(newState) {
		this.authState = Observable.of(newState);
	}
}

class mockActivatedRouteSnapshot extends ActivatedRouteSnapshot {
	data = {
		invert: false,
		redirect: 'test redirect route'
	}
}

describe('AuthGuardService', () => {
	let router;
	let mockAuthStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			providers: [
				AuthGuardService,
				{ provide: AuthStateService, useClass: MockAuthStateService },
			],
		});

		router = TestBed.get(Router);
		mockAuthStateService = TestBed.get(AuthStateService);
	});

	it('should be created', inject([AuthGuardService], (service: AuthGuardService) => {
		expect(service).toBeTruthy();
	}));

	it('should allow authenticated users and redirect unauthenticated ones', inject([AuthGuardService], (service: AuthGuardService) => {
		const spy = spyOn(router, 'navigate');

		const snapshot = new mockActivatedRouteSnapshot();
		service.canActivate(snapshot).subscribe((success) => {
			//Test for authenticated users
			expect(success).toBeTruthy();
			expect(spy).not.toHaveBeenCalled();

			//Test for unauthenticated users
			mockAuthStateService.setAuthState(false);
			service.canActivate(snapshot).subscribe((success) => {
				expect(success).toBeFalsy();
				expect(spy).toHaveBeenCalledWith(['test redirect route']);
			});
		});
	}));
});
