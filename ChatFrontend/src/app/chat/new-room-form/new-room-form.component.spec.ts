import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NewRoomFormComponent } from './new-room-form.component';
import { ChatApiService } from '../chat-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PasswordCacheService } from '../password-cache.service';

class MockChatApiService {

}

class MockPasswordCacheService {

}

describe('NewRoomFormComponent', () => {
	let component: NewRoomFormComponent;
	let fixture: ComponentFixture<NewRoomFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ ReactiveFormsModule, RouterTestingModule ],
			declarations: [ NewRoomFormComponent ],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [
				{ provide: ChatApiService, useClass: MockChatApiService },
				{ provide: PasswordCacheService, useClass: MockPasswordCacheService }
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NewRoomFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
