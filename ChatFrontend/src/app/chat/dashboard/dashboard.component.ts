import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    
    chatRooms = [];
    
    constructor(private chat: ChatService) { }
    
    ngOnInit() {
        this.chat.getChatRoomList()
        .take(1)
        .subscribe((chatRooms) => this.chatRooms = chatRooms);
    }

    joinCb(value) {
        console.log(value);
    }
    
}
