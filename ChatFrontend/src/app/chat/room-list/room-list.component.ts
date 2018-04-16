import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatApiService } from '../chat-api.service';
import { Router } from '@angular/router';
import { ChatRoom } from '../chatRoom';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
    
    chatRooms: ChatRoom[] = [];
    selectedRoom: ChatRoom;
    @Output() roomSelected = new EventEmitter<ChatRoom>();
    @Input() maxListLength = 5;
    @Input() searchString = '';

    constructor(private router: Router, private chat: ChatApiService) {}
    
    ngOnInit() {
        //Populate the list
        this.chat.getChatRoomList()
        .take(1)
        .subscribe((chatRooms: ChatRoom[]) => this.chatRooms = chatRooms);
    }

    selectRoom(chatRoom: ChatRoom): void {
        this.roomSelected.emit(chatRoom);
        this.selectedRoom = chatRoom;
    }
}
