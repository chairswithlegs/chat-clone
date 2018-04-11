import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AuthStateService {
    timeoutDuration = 4000;
    tokenStorageKey = 'JWT-token';
    authState: Observable<boolean>;
    private authSubject: BehaviorSubject<boolean>;

    constructor(private http: HttpClient) {
        this.authSubject = new BehaviorSubject(false);
        //Initially assign the authState to a the token state
        this.authState = this.validateToken();
        //Once the token state has been resolved, let the authState represent the authSubject
        this.authState
        .take(1)
        .subscribe((tokenValidity) => {
            this.authSubject.next(tokenValidity);
            this.authState = this.authSubject.asObservable();
        });
    }
    
    //Attempts to login the user with the server, observable indicates if the operation was successful
    login(username, password): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/api/authentication/login`, { username: username, password: password })
        .timeout(this.timeoutDuration)
        .map((jwt) => {
            if (jwt && jwt['token']) { //If we got a token, login was successful
                console.log('login subscribe fired.');
                localStorage.setItem(this.tokenStorageKey, jwt['token']);
                this.authSubject.next(true);
                return true
            } else { //If not token is present in the payload, something is wrong
                console.error(`Invalid login response from server. Payload: ${jwt}`);
                return false
            }
        })
        .catch((error) => { //If we get an unauthorized error (e.g. bad server code), return a false observable
            //TODO: Propagate error for component handling if the status code is NOT 401 (unauthorized)
            console.error(error);
            return Observable.of(false);
        });
    }

    //Attempts to create a new account, observable indicates if the operation was successful.
    createAccount(username, password): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/api/authentication/create-account`, { username: username, password: password })
        .timeout(this.timeoutDuration)
        .map(() => true)
        .catch((error) => {
            //TODO: Propagate error for component handling if the status code is NOT 401 (unauthorized)
            console.error(error);
            return Observable.of(false)
        });
    }

    getAuthHeader(): string {
        const storedToken = localStorage.getItem(this.tokenStorageKey);

        if (storedToken !== null)
            return `JWT ${storedToken}`;
        else
            return null;
    }

    //Verifies with the server that the currently stored token is valid
    private validateToken(): Observable<boolean> {;
        const authHeader = this.getAuthHeader();

        if (authHeader === null) {
            return Observable.of(false);
        } else {
            console.log('checking token with server.');
            const headers = { Authorization: authHeader };
            return this.http.get(`${environment.apiUrl}/api/authentication/validate-token`, { headers: headers })
            .timeout(this.timeoutDuration)
            .map(() => true) //Set to true if we get to a successful response from the server
            .catch((error) => { //If we get an error (e.g. bad server code), return a false observable
                //TODO: Propagate error for component handling if the status code is NOT 401 (unauthorized)
                console.error(error);
                return Observable.of(false)}
            );
        } 
    }
}
