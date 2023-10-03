import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ErrorMessage, IMAGE_LIST_DATA, MessageType, allowedFileType } from '@constants/image.constant';
import { PuzzlePiece } from '@models/image.model';
import { PuzzleService } from '@services/puzzle.service';
import { SnackbarService } from '@services/snackbar.service';
import { ImgCropperComponent } from '@shared/img-cropper/img-cropper.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [NgIf, NgFor, MatDialogModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnDestroy, OnInit {

  imgPieces = IMAGE_LIST_DATA;
  dragged: any;
  puzzleSolved = false;
  puzzleOver = false;
  puzzleImage!: string;
  imageUploaded = false;
  imgName = '';
  moves = 0;
  OTPTimer = '';
  timeInterval!: ReturnType<typeof setInterval>;
  puzzlePieces: PuzzlePiece[] = [];

  @Output() isSolved = new EventEmitter();
  @Output() isOver = new EventEmitter();
  @Output() puzzleDetails = new EventEmitter();

  unSubscribeAll: Subject<void> = new Subject();

  constructor(
    public snackbarService: SnackbarService,
    private puzzleService: PuzzleService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.puzzleService.puzzlePiece$.subscribe((val: any) => {
      if (val) {
        this.puzzleImage = val.puzzleImage;
        this.puzzlePieces = val.puzzlePieces;
        this.generatePuzzle();
      }
    })
  }

  onFileClick(event: any): void {
    event.target.value = null;
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files as FileList;

    if (file) {
      if (!allowedFileType.includes(file[0].type)) {
        this.snackbarService.showSnackbar(ErrorMessage.invalidFileType, MessageType.error);
        return;
      }
      this.imgName = file[0].name;
      const dialogRef = this.matDialog.open(ImgCropperComponent, {
        panelClass: "img-cropper-dialog",
        maxWidth: '800px',
        disableClose: true,
        data: {
          imageChangedEvent: event,
          aspectRatio: 1 / 1,
          imageFormat: file[0].type.split("/").at(-1),
          fileType: file[0].type,
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.unSubscribeAll)).subscribe((result) => {
        this.puzzleImage = result;
        this.generatePuzzle();
      });
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
    ev.dataTransfer?.setData('text/plain', (<HTMLElement>ev.target)?.id);
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
    this.dragged.parentElement.classList.add('remove-spacing');
    this.moves++;
    this.dragged.remove(this.dragged);
    (<HTMLElement>ev.target).appendChild(this.dragged);
    this.checkPuzzleSolved();
    this.checkPuzzleOver();
    this.isOver.emit(this.puzzleOver);
    this.isSolved.emit(this.puzzleSolved);
    const puzzleDetail = {
      ...this.puzzlePieces,
      puzzleImage: this.puzzleImage
    }
    this.puzzleDetails.emit(puzzleDetail);
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
    if (this.unSubscribeAll) {
      this.unSubscribeAll.next();
      this.unSubscribeAll.complete();
    }
  }
}
