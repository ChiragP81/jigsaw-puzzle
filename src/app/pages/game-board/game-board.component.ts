import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ErrorMessage, IMAGE_HEIGHT, IMAGE_LIST_DATA, IMAGE_WIDTH, MessageType, allowedFileType } from 'src/app/core/constants/image.constant';
import { PuzzlePiece } from 'src/app/core/models/image.model';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy {

  imgPieces = IMAGE_LIST_DATA;
  dragged: any;
  puzzleSolved = false;
  puzzleOver = false;
  puzzleImage!: string;
  imageUploaded = false;
  imgName = '';
  moves = 0;
  OTPTimer: string = '';
  timeInterval: any;
  puzzlePieces: PuzzlePiece[] = [];

  @Output() isSolved = new EventEmitter();
  @Output() isOver = new EventEmitter();

  constructor(
    public snackbarService: SnackbarService
  ) { }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files as FileList;
    if (file) {
      if (!allowedFileType.includes(file[0].type)) {
        this.snackbarService.showSnackbar(ErrorMessage.invalidFileType, MessageType.error);
        return;
      }
      this.imgName = file[0].name;
      const reader = new FileReader();
      const img = new Image();
      reader.onload = () => {
        img.src = reader.result as string;
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          if (width !== IMAGE_WIDTH && height !== IMAGE_HEIGHT) {
            this.snackbarService.showSnackbar(ErrorMessage.invalidImageSize, MessageType.error);
            return;
          }
          this.puzzleImage = reader.result as string;
          this.imageUploaded = true;
          this.generatePuzzle();
        }
      };
      reader.readAsDataURL(file[0]);
    }
  }

  generatePuzzle(): void {
    this.startTimer(300);
    const pieces: PuzzlePiece[] | undefined = [];
    const image = new Image();
    image.src = this.puzzleImage;
    image.onload = () => {
      const imgWidth = Math.floor(image.width / 4);
      const imgHeight = Math.floor(image.height / 4);
      let count = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const piece = {
            backgroundPosition: `-${imgWidth * j}px -${imgHeight * i}px`,
            left: imgWidth * j,
            top: imgHeight * i,
            image: this.getPieceImage(image, count, String(count), imgWidth, imgHeight),
            id: String(count)
          };
          count++;
          pieces.push(piece);
        }
      }
      this.puzzlePieces = pieces;
      this.shufflePuzzlePieces(pieces);
    };
  }

  getPieceImage(image: HTMLImageElement, pieceNumber: number, pieceId: string, pieceWidth: number, pieceHeight: number): string {
    const canvas = document.createElement('canvas');
    canvas.id = pieceId;
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;
    const ctx = canvas.getContext('2d');
    const column = pieceNumber % 4;
    const row = Math.floor(pieceNumber / 4);
    ctx && ctx.drawImage(image, column * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
    return canvas.toDataURL();
  }


  shufflePuzzlePieces(puzzlePieces: PuzzlePiece[]) {
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [puzzlePieces[i], puzzlePieces[j]] = [puzzlePieces[j], puzzlePieces[i]];
    }
  }

  resetPuzzle(): void {
    clearInterval(this.timeInterval);
    this.generatePuzzle();
    this.imgPieces.forEach((img) => {
      const imageEle = document.getElementById(img.index);
      if (imageEle?.hasChildNodes()) {
        imageEle.replaceChildren();
      }
      img.isValidPlaced = false;
      img.placed = false;
    })
    this.moves = 0;
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
      this.snackbarService.showSnackbar(ErrorMessage.samePlacePieceError, MessageType.error);
      return;
    }

    if (dropTarget?.hasChildNodes()) {
      this.snackbarService.showSnackbar(ErrorMessage.samePlacePieceError, MessageType.error);
      return;
    }
    if (this.imgPieces[this.dragged.id].isValidPlaced) {
      this.snackbarService.showSnackbar(ErrorMessage.pieceMoveError, MessageType.error);
      return;
    }
    const drop_id = (<HTMLElement>ev.target)?.id.split("_").at(-1);
    if (drop_id === this.dragged.id) {
      this.imgPieces[this.dragged.id].isValidPlaced = true;
    }
    this.imgPieces[this.dragged.id].placed = true;
    this.moves++;
    this.dragged.classList.remove('m-2');
    this.dragged.remove(this.dragged);
    (<HTMLElement>ev.target).appendChild(this.dragged);
    this.checkPuzzleSolved();
    this.checkPuzzleOver();
    this.isOver.emit(this.puzzleOver);
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

  startTimer(remaining: number): void {
    this.OTPTimer = '05:00';
    this.timeInterval = setInterval(() => {
      let m: string | number = Math.floor(remaining / 60);
      let s: string | number = remaining % 60;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      this.OTPTimer = m + ':' + s;
      remaining--;
      if (remaining === 0) {
        this.puzzleOver = true;
        this.puzzleSolved = false;
        this.isOver.emit(this.puzzleOver);
        this.isSolved.emit(this.puzzleSolved);
        clearInterval(this.timeInterval);
      }
    }, 1000)
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
