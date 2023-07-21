import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IMAGE_LIST_DATA } from '../core/constants/image.constant';
import { PuzzlePiece } from '../core/models/image.model';
import { GameBoardComponent } from "./game-board/game-board.component";
import { ImageComponent } from "./image/image.component";

@Component({
  selector: 'app-pages',
  standalone: true,
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  imports: [ImageComponent, GameBoardComponent, NgIf]
})
export class PagesComponent {
  isPuzzleSolved = false;
  puzzlePiece: PuzzlePiece[] = [];
  isPuzzleReset = false;
  imgPieces = IMAGE_LIST_DATA;

  receiveData(event: boolean): void {
    this.isPuzzleSolved = event;
  }

  onClose(): void {
    this.puzzlePiece = [];
    this.isPuzzleSolved = false;
    this.imgPieces.forEach((img) => {
      img.isValidPlaced = false;
      img.placed = false;
    });
  }
}
