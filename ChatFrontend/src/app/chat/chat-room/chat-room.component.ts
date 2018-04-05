import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../chatRoom';
import { ChatMessage } from '../chatMessage';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent {
	
	chatRoom: ChatRoom;
	
	constructor(private chat: ChatService) { }
	
	sendMessage(message: String) {
		//Send the message to the server
	}
	
}
