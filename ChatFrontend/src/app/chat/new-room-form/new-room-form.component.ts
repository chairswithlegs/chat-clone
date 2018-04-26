import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatApiService } from '../chat-api.service';
import { ChatRoom } from '../chatRoom';
import { PasswordCacheService } from '../password-cache.service';

@Component({
	selector: 'app-new-room-form',
	templateUrl: './new-room-form.component.html',
	styleUrls: ['./new-room-form.component.css']
})
export class NewRoomFormComponent {
	
	form: FormGroup;
	@Input() joinOnCreate = true;
	@Output() roomCreated = new EventEmitter<ChatRoom>(); 
	
	constructor(private formBuilder: FormBuilder, private chat: ChatApiService, private router: Router, private passwordCache: PasswordCacheService) {
		this.form = formBuilder.group({
			name: ['', Validators.required],
			password: ['']
		});
	}

	submit(form: FormGroup) {
		const name = form.controls.name.value;
		const password = form.controls.password.value;

		if (form.valid) {
			this.chat.createChatRoom(name, password)
			.take(1)
			.subscribe((chatRoom) => {
				this.roomCreated.emit(chatRoom);

				if (this.joinOnCreate) {
					this.passwordCache.setPassword(password);
					this.router.navigate(['chat-room', chatRoom.roomId, chatRoom.hasPassword]);
				}
			});
		}
	}
}
