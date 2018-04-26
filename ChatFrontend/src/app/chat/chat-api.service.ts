import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChatRoom } from './chatRoom';
import { environment } from '../../environments/environment';
import { AuthStateService } from '../authentication/auth-state.service';
import { Socket } from 'socket.io';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import { Message } from './message';


@Injectable()
export class ChatApiService {
	
	constructor(private http: HttpClient, private auth: AuthStateService) {}
	
	//Gets the list of available chat rooms
	getChatRoomList(): Observable<ChatRoom[]>  {
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		return this.http.get(`${environment.apiUrl}/api/chat/room-list`, { headers: headers })
		.map((chatRooms: ChatRoom[]) => chatRooms); //Strongly type the response
	}
	
	//Gets a chat room by id
	getChatRoom(roomId: string): Observable<ChatRoom> {
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		return this.http.get(`${environment.apiUrl}/api/chat/room-list/${roomId}`, { headers: headers })
		.map((chatRoom: ChatRoom) => chatRoom); //Strongly type the response
	}	
	
	//Creates a chat room on the server and returns the room id
	createChatRoom(name: string, password: string): Observable<ChatRoom> {
		//Get the authorization header so we can authenticate the request
		const headers = { Authorization: this.auth.getAuthHeader() };
		
		//Create the body of the request and send it
		const body = { name: name };
		if (password) body['password'] = password; //optionally add a password
		return this.http.post(`${environment.apiUrl}/api/chat/create-room`, body, { headers: headers })
		.map((response: { message: string, room: ChatRoom }) => response.room); //Strongly type the response
	}
	
	//Returns an observable of messages using a socket connection
	getMessages(socket: Socket): Observable<Message> {
		const subject = new Subject<Message>();
		socket.on('message', (message) => subject.next(message));
		return subject.asObservable();
	}

	//Attempts to create a socket connection to a chat room
	createChatRoomSocket(roomId: string, password: string): Observable<Socket> {
		return Observable.create((observer) => {
			//Create a new socket connection
			const socket = io(environment.apiUrl, { timeout: 3000 });
			
			//Reject if the connection fails
			socket.on('error', (error) => observer.error(error));
			
			//Once the socket is opened, make is the output of this observable
			socket.on('connect', () => observer.next(socket));
		}).mergeMap((socket) => {
			//Get the authorization header so we can authenticate the request
			const headers = { Authorization: this.auth.getAuthHeader() };
			
			//Populate the body and fire off the join request
			const body = {
				roomId: roomId,
				password: password,
				socketId: socket.id
			}
			
			return this.http.post(`${environment.apiUrl}/api/chat/join-room`, body, { headers: headers })
			.map(() => socket);
		});
	}
	
	//Sends a message using a socket
	sendMessage(roomId: String, messageText: string, socket: Socket): Observable<Message> {
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
		return this.http.post(`${environment.apiUrl}/api/chat/send-message`, body, { headers: headers })
		.map((message: Message) => message); //Strongly type the response
	}

}
