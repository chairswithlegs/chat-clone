import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RoomListComponent } from './room-list.component';
import { ChatApiService } from '../chat-api.service';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ChatRoom } from '../chatRoom';
import { Observable } from 'rxjs';

class MockChatApiService {
	getChatRoomList() {
		const chatRoom = new ChatRoom();
		chatRoom.name = 'Test Room';
		return Observable.of([chatRoom]);
	}
}

@Pipe({
	name: 'searchFilter'
})
export class MockSearchFilterPipe implements PipeTransform {
	transform(items: any[], searchString: string, filterProperty?: any, maxResults?: number): any {
		return [];
	}
}

describe('RoomListComponent', () => {
	let component: RoomListComponent;
	let fixture: ComponentFixture<RoomListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ RouterTestingModule ],
			declarations: [ RoomListComponent, MockSearchFilterPipe ],
			schemas: [ NO_ERRORS_SCHEMA ],
			providers: [{ provide: ChatApiService, useClass: MockChatApiService }],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RoomListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get the chatroom list', () => {
		expect(component.chatRooms[0].name).toBe('Test Room');
	});
});
