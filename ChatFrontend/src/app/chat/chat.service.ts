import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from './chatRoom';
import { ChatMessage } from './chatMessage';


@Injectable()
export class ChatService {

	private socket;
	constructor() {
		this.socket = io("http://localhost:3000");
	}
	
	getChatRoomList(): Observable<ChatRoom[]>  {
		//Gets the list of available chat rooms
		return Observable.of([]);
	}
	
	//Creates a chat room on the server and returns the room id
	createChatRoom(roomName: String): Observable<string> {
		//Create a room on the server
		return Observable.of('');
	}

	getMessages(roomId: String): Observable<ChatMessage[]> {
		return Observable.of([]);
	}
	
	sendMessage(roomId: String, message: ChatMessage) {
		//Sends a message to everyone in the room
	}
}
