import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IMAGE_LIST_DATA } from '@constants/image.constant';
import { PuzzlePiece } from '@models/image.model';
import { GameBoardComponent } from "@pages/game-board/game-board.component";
import { PuzzleService } from '@services/puzzle.service';

@Component({
  selector: 'app-pages',
  standalone: true,
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  imports: [GameBoardComponent, NgIf]
})
export class PagesComponent {
  isPuzzleSolved = false;
  puzzlePiece: PuzzlePiece[] = [];
  imgPieces = IMAGE_LIST_DATA;
  isPuzzleOver = false;
  constructor(public puzzleService: PuzzleService) { }

  GetPuzzleSolvedValue(event: boolean): void {
    this.isPuzzleSolved = event;
    if (this.isPuzzleSolved) {
      this.puzzleService.clearPuzzlePieces();
    }
  }

  onClose(): void {
    this.puzzlePiece = [];
    this.isPuzzleOver = false;
    this.imgPieces.forEach((img) => {
      img.isValidPlaced = false;
      img.placed = false;
    });
    this.puzzleService.clearPuzzlePieces();
  }

  getPuzzleOverValue(event: boolean): void {
    this.isPuzzleOver = event;
  }

  onTryAgain(): void {
    this.isPuzzleOver = false;
    this.imgPieces.forEach((img) => {
      img.isValidPlaced = false;
      img.placed = false;
    });
  }
}
