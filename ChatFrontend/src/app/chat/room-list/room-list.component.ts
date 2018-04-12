import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
    
    @Input() chatRooms = [];
    @Output() joinClick = new EventEmitter<string>();
    
    constructor() { }
    
    ngOnInit() {
    }

}
