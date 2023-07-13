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
  isOverPuzzle = false;
  pieceHeight!: number;
  pieceWidth!: number;
  puzzlePiece: PuzzlePiece[] = [];

  imgPieces = IMAGE_LIST_DATA;


  receiveData(event: boolean): void {
    this.isOverPuzzle = event;
  }

  getPieceHeight(height: number): void {
    this.pieceHeight = height;
  }

  getPieceWidth(width: number): void {
    this.pieceWidth = width;
  }

  getPuzzlePiece(pieces: PuzzlePiece[]): void {
    this.puzzlePiece = pieces;
  }

  onClose(): void {
    this.puzzlePiece = [];
    this.isOverPuzzle = false;
    this.imgPieces.forEach((img) => img.misplaced = true);
  }
}
