import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatRoomComponent } from './chat-room.component';
import { ChatApiService } from '../chat-api.service';
import { PasswordCacheService } from '../password-cache.service';

class MockChatApiService {

}

class MockActivatedRoute {

}

class MockPasswordCacheService {

}

describe('ChatRoomComponent', () => {
	let component: ChatRoomComponent;
	let fixture: ComponentFixture<ChatRoomComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ChatRoomComponent],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [
				{ provide: ChatApiService, useClass: MockChatApiService },
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: PasswordCacheService, useClass: MockPasswordCacheService }
			]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChatRoomComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
