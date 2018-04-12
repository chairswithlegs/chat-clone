import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';
import { RoomListComponent } from './room-list/room-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DashboardComponent
  ],
  providers: [ChatService],
  declarations: [DashboardComponent, ChatRoomComponent, RoomListComponent]
})
export class ChatModule { }
