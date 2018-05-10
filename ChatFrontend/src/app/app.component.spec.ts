import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AuthStateService } from './authentication/auth-state.service';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';

class MockAuthStateService {
    authState = Observable.of(false);
    
    logout() {}
    
    setAuthState(state: boolean) {
        this.authState = Observable.of(state);
    } 
}

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let auth: MockAuthStateService;
    let loggedInMenuItem: DebugElement;
    let loggedOutMenuItem: DebugElement;
    
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				AppComponent
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [{ provide: AuthStateService, useClass: MockAuthStateService }]
		}).compileComponents();
    }));
    
    beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
        fixture.detectChanges();
        auth = TestBed.get(AuthStateService);
    });
    
	it('should create the app', async(() => {
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
    }));
    
    it('should call logout in the AuthStateService', async(() => {
        const spy = spyOn(auth, 'logout');
        component.logout();
        expect(spy).toHaveBeenCalled();
    }));
    
    it('should show the correct navigation options based on the user\'s authentication state', async(() => {
        //Set the auth state to false (logged out)
        auth.setAuthState(false);
        fixture.detectChanges();
        
        //Find and verify the presence of the correct elements (will be null if not found)
        loggedInMenuItem = fixture.debugElement.query(By.css('.logged-in-item'));
        loggedOutMenuItem = fixture.debugElement.query(By.css('.logged-out-item'));
        expect(loggedInMenuItem).toBeNull();
        expect(loggedOutMenuItem).toBeTruthy();
        
        //Set the auth state to false (logged out)
        auth.setAuthState(true);
        fixture.detectChanges();
        
        //Find and verify the presence of the correct elements (will be null if not found)
        loggedInMenuItem = fixture.debugElement.query(By.css('.logged-in-item'));
        loggedOutMenuItem = fixture.debugElement.query(By.css('.logged-out-item'));
        expect(loggedOutMenuItem).toBeNull();
        expect(loggedInMenuItem).toBeTruthy();
    }));
});
