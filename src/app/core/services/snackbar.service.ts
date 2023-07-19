import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageType } from '../constants/image.constant';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  private snackbarSubject$ = new Subject();
  snackbarState = this.snackbarSubject$.asObservable();

  showSnackbar(message: string, type: MessageType.success | MessageType.error): void {
    this.snackbarSubject$.next({ show: true, message, type })
  }
}
