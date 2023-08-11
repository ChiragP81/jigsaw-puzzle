import { Injectable } from '@angular/core';
import { StorageKey } from '@constants/image.constant';
import { PuzzleDetails } from '@models/image.model';
import { StorageService } from '@services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  public puzzlePieceSubject$ = new BehaviorSubject<PuzzleDetails[] | null | string>(null);

  constructor(private storageService: StorageService) {
    if (this.storageService.get(StorageKey)) {
      this.puzzlePieceSubject$ = new BehaviorSubject<PuzzleDetails[] | null | string>(
        JSON.parse(this.storageService.get(StorageKey) as string)
      );
      console.log(this.puzzlePieceSubject$);
    }
  }

  clearPuzzlePieces() {
    this.puzzlePieceSubject$.next(null);
    this.storageService.remove(StorageKey);
    this.storageService.clear();
  }
}
