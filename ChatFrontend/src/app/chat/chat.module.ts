import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';
import { RoomListComponent } from './room-list/room-list.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewRoomFormComponent } from './new-room-form/new-room-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    DashboardComponent
  ],
  providers: [ChatService],
  declarations: [DashboardComponent, ChatRoomComponent, RoomListComponent, SearchFilterPipe, NewRoomFormComponent]
})
export class ChatModule { }
