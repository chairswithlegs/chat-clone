import { TestBed, inject } from '@angular/core/testing';

import { PasswordCacheService } from './password-cache.service';

describe('PasswordCacheService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PasswordCacheService]
		});
	});

	it('should be created', inject([PasswordCacheService], (service: PasswordCacheService) => {
		expect(service).toBeTruthy();
	}));
});
