import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DashboardComponent
  ],
  providers: [ChatService],
  declarations: [DashboardComponent, ChatRoomComponent]
})
export class ChatModule { }
