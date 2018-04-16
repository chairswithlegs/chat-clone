import { Component, OnInit } from '@angular/core';
import { ChatApiService } from '../chat-api.service';
import { Router } from '@angular/router';
import { ChatRoom } from '../chatRoom';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    
    chatRooms = [];
    
    constructor(private chat: ChatApiService, private router: Router) {}
    
    ngOnInit() {
        this.chat.getChatRoomList()
        .take(1)
        .subscribe((chatRooms) => this.chatRooms = chatRooms);
    }

    joinChatRoom(roomId: string, password: boolean) {
        this.router.navigate(['chat-room', roomId, password]);
    }
    
}
