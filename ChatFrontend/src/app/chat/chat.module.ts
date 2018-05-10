import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatApiService } from './chat-api.service';
import { RoomListComponent } from './room-list/room-list.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewRoomFormComponent } from './new-room-form/new-room-form.component';
import { PasswordCacheService } from './password-cache.service';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule
	],
	exports: [
		DashboardComponent
	],
	providers: [ChatApiService, PasswordCacheService],
	declarations: [DashboardComponent, ChatRoomComponent, RoomListComponent, SearchFilterPipe, NewRoomFormComponent]
})
export class ChatModule { }
