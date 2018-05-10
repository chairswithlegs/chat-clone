import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ChatApiService } from './chat-api.service';
import { AuthStateService } from '../authentication/auth-state.service';

class MockHttpClient {

}

class MockAuthStateService {

}

describe('ChatService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ChatApiService,
				{ provide: HttpClient, useClass: MockHttpClient },
				{ provide: AuthStateService, useClass: MockAuthStateService }
			]
		});
	});

	it('should be created', inject([ChatApiService], (service: ChatApiService) => {
		expect(service).toBeTruthy();
	}));
});
