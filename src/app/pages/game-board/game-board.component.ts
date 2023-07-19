import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IMAGE_LIST_DATA, MessageType } from 'src/app/core/constants/image.constant';
import { PuzzlePiece } from 'src/app/core/models/image.model';
import { ImagesService } from 'src/app/core/services/images.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnChanges {

  imgPieces = IMAGE_LIST_DATA;
  dragged: any;
  puzzleSolved = false;
  puzzleOver = false;

  @Input() pieceWidth!: number;
  @Input() pieceHeight!: number;
  @Input() pieces!: PuzzlePiece[];
  @Input() isReset!: boolean;

  @Output() isSolved = new EventEmitter();

  constructor(
    public sanitizer: DomSanitizer,
    public imageService: ImagesService,
    public snackbarService: SnackbarService
  ) { }

  ngOnChanges(): void {
    this.isReset && this.resetPuzzle();
  }

  resetPuzzle(): void {
    this.imgPieces.forEach((img) => {
      const imageEle = document.getElementById(img.index);
      if (imageEle?.hasChildNodes()) {
        imageEle.replaceChildren();
      }
      img.isValidPlaced = false;
      img.placed = false;
      const newImage = {
        ...img,
        isValidPlaced: false,
        placed: false
      }
      img = newImage;
    })
    this.checkPuzzleOver();
  }

  onDrag(ev: DragEvent): void {
    ev.dataTransfer?.setData("index", (<HTMLElement>ev.target)?.id);
    this.dragged = ev.target;
  }

  onDrop(ev: DragEvent): void {
    ev.preventDefault();
    const dropTarget = document.getElementById((<HTMLElement>ev.target)?.id);

    if (dropTarget && dropTarget.parentElement && dropTarget.parentElement?.className !== 'board') {
      this.snackbarService.showSnackbar('You can not place two piece at same place', MessageType.error);
      return;
    }

    if (dropTarget?.hasChildNodes()) {
      this.snackbarService.showSnackbar('You can not place two piece at same place', MessageType.error);
      return;
    }
    if (this.imgPieces[this.dragged.id].isValidPlaced) {
      this.snackbarService.showSnackbar('You can not move solved puzzle', MessageType.error);
      return;
    }
    const drop_id = (<HTMLElement>ev.target)?.id.split("_").at(-1);
    if (drop_id === this.dragged.id) {
      this.imgPieces[this.dragged.id].isValidPlaced = true;
    }
    this.imgPieces[this.dragged.id].placed = true;
    this.dragged.classList.remove('m-2');
    this.dragged.remove(this.dragged);
    (<HTMLElement>ev.target).appendChild(this.dragged);
    this.checkPuzzleSolved();
    this.checkPuzzleOver();
    this.isSolved.emit(this.puzzleSolved);
  }

  onDragOver(ev: DragEvent): void {
    ev.preventDefault();
  }

  checkPuzzleSolved(): boolean {
    this.puzzleSolved = this.imgPieces.every((e) => e.isValidPlaced);
    return this.puzzleSolved;
  }

  checkPuzzleOver(): boolean {
    this.puzzleOver = this.imgPieces.every((e) => e.placed);
    return this.puzzleOver;
  }
}
