import { Injectable } from '@angular/core';
import { StorageKey } from '@constants/image.constant';
import { PuzzleDetails } from '@models/image.model';
import { StorageService } from '@services/storage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {

  public puzzlePieceSubject$ = new BehaviorSubject<PuzzleDetails | null | string>(null);
  public puzzlePiece$ = this.puzzlePieceSubject$.asObservable();

  constructor(private storageService: StorageService) { }

  setPuzzleDetails(data: PuzzleDetails) {
    this.puzzlePieceSubject$.next(data);
  }
  clearPuzzlePieces(): void {
    this.puzzlePieceSubject$.next(null);
    this.storageService.remove(StorageKey);
    this.storageService.clear();
  }
}
