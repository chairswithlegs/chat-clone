import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountCreationComponent } from './account-creation.component';
import { AuthStateService } from '../auth-state.service';

class MockAuthStateService {

}

describe('AccountCreationComponent', () => {
	let component: AccountCreationComponent;
	let fixture: ComponentFixture<AccountCreationComponent>;

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
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
