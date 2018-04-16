import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatApiService } from '../chat-api.service';
import { ChatRoom } from '../chatRoom';
import { Message } from '../message';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'socket.io';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
	
	messages: Message[] = [];
	showPasswordPrompt = false;

	private roomId: string;
	private socket: Socket;
	private paramSub: Subscription;
	
	constructor(private chat: ChatApiService, private activatedRoute: ActivatedRoute) {}
	
	ngOnInit() {
		//Load the route parameters (room id and password protection state)
		this.paramSub = this.activatedRoute.params.subscribe((params) => {
			this.roomId = params['roomId'];
			
			//If a password is required, show the prompt. Otherwise, simply connect.
			if (params['password']) {
				this.showPasswordPrompt = true;
			} else {
				this.connect();
			}
		});
	}
	
	ngOnDestroy() {
		//Cleanup the subscription to avoid a memory leak
		if (this.paramSub) this.paramSub.unsubscribe();
	}

	sendMessage(messageText: string): void {
		//Make sure the room id and socket have been created
		if (this.roomId && this.socket) {
			//Send the message
			this.chat.sendMessage(this.roomId, messageText, this.socket)
			.take(1)
			.subscribe();
		}
	}
	
	addMessage(message: Message): void {
		this.messages.push(message);
	}

	private connect(password = ''): void {
		//Try and create the socket connection
		this.chat.createChatRoomSocket(this.roomId, password).subscribe((socket) => {
			//If the connection goes through, start the messaging stream
			this.chat.getMessages(socket).subscribe((message) => this.addMessage(message));
			//Save the socket connection (so we can send messages with it)
			this.socket = socket;
			//and hide the password prompt
			this.showPasswordPrompt = false;
		}, (error) => {
			//TODO: Alert the user to try a different password
		});
	}
}
