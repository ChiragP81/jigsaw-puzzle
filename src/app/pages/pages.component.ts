import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IMAGE_LIST_DATA } from '../core/constants/image.constant';
import { PuzzlePiece } from '../core/models/image.model';
import { GameBoardComponent } from "./game-board/game-board.component";

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
  isPuzzleReset = false;
  imgPieces = IMAGE_LIST_DATA;
  isPuzzleOver = false;

  GetPuzzleSolvedValue(event: boolean): void {
    this.isPuzzleSolved = event;
  }

  onClose(): void {
    this.puzzlePiece = [];
    this.isPuzzleOver = false;
    this.imgPieces.forEach((img) => {
      img.isValidPlaced = false;
      img.placed = false;
    });
  }

  getPuzzleOverValue(event: boolean): void {
    this.isPuzzleOver = event;
  }
}
