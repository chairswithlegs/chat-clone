import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NewRoomFormComponent } from './new-room-form.component';
import { ChatApiService } from '../chat-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordCacheService } from '../password-cache.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

class MockChatApiService {
	createChatRoom(name, password) {
		return Observable.of({
			roomId: '1234',
			hasPassword: true
		});
	}
}

class MockPasswordCacheService {
	setPassword() {}
}

class MockRouter {
	navigate() {}
}

describe('NewRoomFormComponent', () => {
	let component: NewRoomFormComponent;
	let fixture: ComponentFixture<NewRoomFormComponent>;
	let mockPasswordCacheService: MockPasswordCacheService;
	let mockRouter: MockRouter;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ ReactiveFormsModule, RouterTestingModule ],
			declarations: [ NewRoomFormComponent ],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [
				{ provide: ChatApiService, useClass: MockChatApiService },
				{ provide: PasswordCacheService, useClass: MockPasswordCacheService },
				{ provide: Router, useClass: MockRouter }
			
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewRoomFormComponent);
		component = fixture.componentInstance;
		mockPasswordCacheService = TestBed.get(PasswordCacheService);
		mockRouter = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should submit the form', () => {
		const passwordSpy = spyOn(mockPasswordCacheService, 'setPassword');
		const routerSpy = spyOn(mockRouter, 'navigate');
		component.joinOnCreate = true;

		component.form.controls['name'].setValue('test name');
		component.form.controls['password'].setValue('test password')

		fixture.detectChanges();

		expect(component.form.valid).toBeTruthy();
		component.submit(component.form);

		fixture.detectChanges();

		expect(passwordSpy).toHaveBeenCalledWith('test password');
		expect(routerSpy).toHaveBeenCalled();
	});
});
