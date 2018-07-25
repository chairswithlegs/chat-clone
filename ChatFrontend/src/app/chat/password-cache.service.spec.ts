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

	it('should be get and set the password', inject([PasswordCacheService], (service: PasswordCacheService) => {
		expect(service.getPassword()).toBeFalsy();
		service.setPassword('test password');
		expect(service.getPassword()).toBe('test password');
	}));

	it('should clear the password', inject([PasswordCacheService], (service: PasswordCacheService) => {
		service.setPassword('test password');
		expect(service.getPassword()).toBe('test password');
		service.clearCache();
		expect(service.getPassword()).toBeFalsy();
	}));
});
