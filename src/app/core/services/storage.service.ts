import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    @Inject('LOCALSTORAGE') private localStorage: Storage
  ) { }


  get(key: string) {
    try {
      return this.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: any) {
    key && value && this.localStorage.setItem(key, value);
  }

  remove(key: string) {
    key && this.localStorage.removeItem(key);
  }

  clear() {
    this.localStorage.clear();
  }
}
