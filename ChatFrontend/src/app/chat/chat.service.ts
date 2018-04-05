import { Injectable } from '@angular/core';

@Injectable()
export class ChatService {

  activeRoomId: String;

  constructor() { }

  getChatRoomList() {
    //Gets the list of available chat rooms
  }

  createChatRoom(roomName: String) {
    //Create a room
  }

  enterChatRoom(roomId: String) {
    //Enter a chatroom
  }

  sendMessage(roomId: String, message: String) {
    //Sends a message to everyone in the room
  }

}
