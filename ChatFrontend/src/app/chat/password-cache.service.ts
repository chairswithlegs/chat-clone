import { Injectable } from '@angular/core';

@Injectable()
export class PasswordCacheService {
  private password: string = null;

  getPassword() { 
    return this.password
  }

  setPassword(password: string) {
    this.password = password
  }

  clearCache() {
    this.password = null;
  }
}
