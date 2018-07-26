import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ChatApiService } from '../chat-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from '../chatRoom';
import { Router } from '@angular/router';

class MockChatApiService {
	getChatRoomList() {
		const chatRoom = new ChatRoom();
		chatRoom.name = 'test room';
		return Observable.of([chatRoom]);
	}
}

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			declarations: [ DashboardComponent ],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [{ provide: ChatApiService, useClass: MockChatApiService }]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		router = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the chatroom list', () => {
		expect(component.chatRooms[0].name).toBe('test room');
	});

	it('should navigate to the chat room route', () => {
		const spy = spyOn(router, 'navigate');
		component.joinChatRoom('', false);
		expect(spy).toHaveBeenCalled();
	});
});
