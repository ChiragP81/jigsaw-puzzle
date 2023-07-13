import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class GameBoardComponent {

  imgPieces = IMAGE_LIST_DATA;
  dragged: any;
  over = false;

  @Input() pieceWidth!: number;
  @Input() pieceHeight!: number;
  @Input() pieces!: PuzzlePiece[];

  @Output() isOver = new EventEmitter();

  constructor(
    public sanitizer: DomSanitizer,
    public imageService: ImagesService,
    public snackbarService: SnackbarService
  ) { }

  onDrag(ev: DragEvent): void {
    ev.dataTransfer?.setData("index", (<HTMLElement>ev.target)?.id);
    this.dragged = ev.target;
  }

  onDrop(ev: any): void {
    ev.preventDefault();
    const dropTarget = document.getElementById(ev.target.id);

    if (dropTarget && dropTarget.parentElement && dropTarget.parentElement?.className !== 'board') {
      this.snackbarService.showSnackbar('You can not place two piece at same place', MessageType.danger);
      return;
    }

    if (dropTarget?.hasChildNodes()) {
      this.snackbarService.showSnackbar('You can not place two piece at same place', MessageType.danger);
      return;
    }
    if (!this.imgPieces[this.dragged.id].misplaced) {
      this.snackbarService.showSnackbar('You can not move solved puzzle', MessageType.danger);
      return;
    }
    const drop_id = ev.target.id.split("_").at(-1);
    if (drop_id === this.dragged.id) {
      this.imgPieces[this.dragged.id].misplaced = false;
    }
    this.dragged.classList.remove('m-2');

    this.dragged.remove(this.dragged);
    ev.target.appendChild(this.dragged);
    this.checkOver();
    this.isOver.emit(this.over);
  }

  onDragOver(ev: any): void {
    ev.preventDefault();
  }

  checkOver(): boolean {
    this.over = this.imgPieces.every((e) => e.misplaced === false);
    return this.over;
  }
}
