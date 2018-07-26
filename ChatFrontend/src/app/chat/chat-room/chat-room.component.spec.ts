import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatRoomComponent } from './chat-room.component';
import { ChatApiService } from '../chat-api.service';
import { PasswordCacheService } from '../password-cache.service';
import { Observable } from 'rxjs/Observable';
import { Message } from '../message';

class MockChatApiService {
	createChatRoomSocket(roomId: String, password: String) {
		return Observable.of('mock socket');
	}

	getMessages(socket) {
		const message = new Message();
		message.messageText = 'test text';
		return Observable.of(message);
	}

	sendMessage() {
		return Observable.of(null);
	}
}

class MockActivatedRoute {
	params = Observable.of({
		roomId: '1234',
		password: 'true'
	});
}

class MockPasswordCacheService {
	getPassword() {
		return 'test password';
	}

	clearCache() {}
}

describe('ChatRoomComponent', () => {
	let component: ChatRoomComponent;
	let fixture: ComponentFixture<ChatRoomComponent>;
	let mockPasswordCacheService: MockPasswordCacheService;
	let mockChatApiService: MockChatApiService;
	let getPasswordSpy;
	let connectSpy;

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
		mockPasswordCacheService = TestBed.get(PasswordCacheService);
		mockChatApiService = TestBed.get(ChatApiService);

		getPasswordSpy = spyOn(mockPasswordCacheService, 'getPassword')
		.and.callThrough();
		connectSpy = spyOn<any>(component, 'connect')
		.and.callThrough();

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should use the cached password when accessing a protected room', () => {
		expect(getPasswordSpy).toHaveBeenCalled();
		expect(connectSpy).toHaveBeenCalledWith('test password');
	});

	it('should load the chat room messages', () => {
		expect(component.messages.length).toBe(1);
	});

	it('should send a message', () => {
		const spy = spyOn(mockChatApiService, 'sendMessage')
		.and.callThrough();

		component.sendMessage('test message');
		expect(spy).toHaveBeenCalledWith('1234', 'test message', 'mock socket');
	});
});
