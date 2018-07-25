import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ChatApiService } from './chat-api.service';
import { AuthStateService } from '../authentication/auth-state.service';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from './chatRoom';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io';

class MockHttpClient {
	get(url, header) {
		if (url === `${environment.apiUrl}/api/chat/room-list`) {
			const chatRoom = new ChatRoom();
			chatRoom.name = 'test room';
			return Observable.of([chatRoom]);
		} else if (url === `${environment.apiUrl}/api/chat/room-list/1234`) {
			const chatRoom = new ChatRoom();
			chatRoom.name = 'test room';
			return Observable.of(chatRoom);
		}
	}

	post(url, body, header) {
		if (url === `${environment.apiUrl}/api/chat/create-room`) {
			const chatRoom = new ChatRoom();
			chatRoom.name = body.name;
			return Observable.of({ message: 'success', room: chatRoom });
		} else if (url === `${environment.apiUrl}/api/chat/join-room`) {

		}
	}
}

class MockAuthStateService {
	getAuthHeader() {
		return 'JWT...'
	}
}

describe('ChatService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ChatApiService,
				{ provide: HttpClient, useClass: MockHttpClient },
				{ provide: AuthStateService, useClass: MockAuthStateService }
			]
		});
	});

	it('should be created', inject([ChatApiService], (service: ChatApiService) => {
		expect(service).toBeTruthy();
	}));

	it('should get the available chat rooms', inject([ChatApiService], async(service: ChatApiService) => {
		service.getChatRoomList().subscribe((roomList) => {
			expect(roomList[0].name).toBe('test room');
		});
	}));

	it('should get a chat room', inject([ChatApiService], async(service: ChatApiService) => {
		service.getChatRoom('1234').subscribe((chatRoom) => {
			expect(chatRoom.name).toBe('test room');
		});
	}));

	it('should create a chat room', inject([ChatApiService], async(service: ChatApiService) => {
		service.createChatRoom('test name', 'test password').subscribe((chatRoom) => {
			expect(chatRoom.name).toBe('test name');
		});
	}));
});
