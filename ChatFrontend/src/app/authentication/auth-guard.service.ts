import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(private auth: AuthStateService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		return this.auth.authState.take(1)
			.map((loggedIn) => {
				//Reverse the default setting, blocking authenticated users
				if (route.data.invert) {
					loggedIn = !loggedIn;
				}

				if (loggedIn) {
					return true;
				} else {
					//Navigate to the redirect location, specified in the route map
					if (route.data.redirect) {
						this.router.navigate([route.data.redirect]);
					}

					return false;
				}
			})
			.catch((error) => {
				//Navigate to the redirect location, specified in the route map
				if (route.data.redirect) {
					this.router.navigate([route.data.redirect]);
				}

				return Observable.of(false);
			});
	}
}
