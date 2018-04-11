import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from './chatRoom';
import { ChatMessage } from './chatMessage';
import { environment } from '../../environments/environment';
import { AuthStateService } from '../authentication/auth-state.service';
import { Socket } from 'socket.io';
import 'rxjs/add/observable/throw';


@Injectable()
export class ChatService {
	
	constructor(private http: HttpClient, private auth: AuthStateService) {}
	
	//Gets the list of available chat rooms
	getChatRoomList(): Observable<any>  {
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		return this.http.get(`${environment.apiUrl}/api/chat/room-list`, { headers: headers });
	}
	
	//Creates a chat room on the server and returns the room id
	createChatRoom(name: string, password: string): Observable<any> {
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		//Create the body of the request and send it
		const body = { name: name };
		if (password) body['password'] = password; //optionally add a password
		return this.http.post(`${environment.apiUrl}/api/chat/create-room`, body, { headers: headers });
	}
	
	//Attempts to create a socket connection to a chat room
	connectToRoom(roomId: string, password: string): Promise<Socket> {
		return new Promise((resolve, reject) => {
			//Create a new socket connection
			const socket = io('http://localhost:3000', { timeout: 3000 });
			
			//Reject if the connection fails
			socket.on('error', (error) => reject(error));
			
			//Once the socket is opened, attempt to join the room
			socket.on('connect', () => {
				//Get the authorization header so we can authenticate the request
				const headers = { Authorization: this.auth.getAuthHeader() };
				
				//Populate the body and fire off the join request
				const body = {
					roomId: roomId,
					password: password,
					socketId: socket.id
				}
				this.http.post(`${environment.apiUrl}/api/chat/join-room`, body, { headers: headers })
				.take(1)
				.subscribe(() => resolve(socket), (error) => {
					socket.close();
					reject(error);
				});
			});
		});
	}
	
	//Sends a message using a socket
	sendMessage(roomId: String, messageText: string, socket: Socket): Observable<any> {
		//Verify that the socket is actually connected
		if (!socket.connected) return Observable.throw('Socket not connected. Failed to send message.');
		
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		//Populate and send the request
		const body = {
			roomId: roomId,
			messageText: messageText,
			socketId: socket.id
		}
		return this.http.post(`${environment.apiUrl}/api/chat/create-message`, body, { headers: headers });
	}
}
