import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DashboardComponent
  ],
  declarations: [DashboardComponent, FriendListComponent, ChatRoomComponent]
})
export class ChatModule { }
