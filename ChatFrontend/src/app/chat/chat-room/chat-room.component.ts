import { Component, OnInit, OnDestroy, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ChatApiService } from '../chat-api.service';
import { ChatRoom } from '../chatRoom';
import { Message } from '../message';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Socket } from 'socket.io';
import { PasswordCacheService } from '../password-cache.service';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
	
	messages: Message[] = [];
	showPasswordPrompt = false;
	invalidPassword = false;
	@ViewChild('messageContainer') messageContainer: ElementRef;
	
	private roomId: string;
	private socket: Socket;
	private paramSub: Subscription;
	private scrollSticky = false;
	
	constructor(private chat: ChatApiService, private activatedRoute: ActivatedRoute, private passwordCache: PasswordCacheService) {}
	
	ngOnInit() {
		//Load the route parameters (room id and password protection state)
		this.paramSub = this.activatedRoute.params.subscribe((params) => {
			this.roomId = params['roomId'];
			
			//If a password is required try using the cached password or show the prompt, otherwise simply connect.
			if (params['password'] === 'true' && this.passwordCache.getPassword()) {
				this.connect(this.passwordCache.getPassword());
				this.passwordCache.clearCache();
			} else if (params['password'] === 'true') {
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
	
	//When the view changes, move the scrollbar to the bottom if it is sticky - see addMessage()
	ngAfterViewChecked() {
		const el = this.messageContainer.nativeElement;
		if (this.scrollSticky) {
			el.scrollTop = el.scrollHeight;
			//Once the scrollbar has been updated, when can clear the sticky state until the next message arrives
			//This prevents the scrollbar from jumping if the view changes for non-message related reasons
			this.scrollSticky = false;
		}
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
		
		//If the user is at the bottom of the chat (i.e. looking at latest message), make scrollbar sticky
		const el = this.messageContainer.nativeElement;
		//2px buffer to allow for minor misalignment
		if (el.scrollTop + 2 >= el.scrollHeight - el.clientHeight) {
			this.scrollSticky = true;
		} else {
			this.scrollSticky = false;
		}
	}
	
	private connect(password = ''): void {
		//Try and create the socket connection
		this.chat.createChatRoomSocket(this.roomId, password).subscribe((socket) => {
			//If the connection goes through, start the messaging stream
			this.chat.getMessages(socket).subscribe((message) => this.addMessage(message));
			//Save the socket connection (so we can send messages with it)
			this.socket = socket;
			//hide the password prompt
			this.showPasswordPrompt = false;
		}, (error) => {
			//If the cache password fails for some reason, we need to show the prompt
			this.showPasswordPrompt = true;
			//Alert the user to try a different password
			this.invalidPassword = true;
		});
	}
}
