import { TestBed, inject } from '@angular/core/testing';

import { ChatApiService } from './chat-api.service';

describe('ChatService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ChatApiService]
		});
	});

	it('should be created', inject([ChatApiService], (service: ChatApiService) => {
		expect(service).toBeTruthy();
	}));
});
