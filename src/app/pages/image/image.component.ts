import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH, MessageType } from 'src/app/core/constants/image.constant';
import { PuzzlePiece } from 'src/app/core/models/image.model';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  puzzleImage!: string;
  imageUploaded = false;
  imgName = '';
  @Output() pieceWidth = new EventEmitter();
  @Output() pieceHeight = new EventEmitter();
  @Output() puzzlePieces = new EventEmitter<PuzzlePiece[]>();

  constructor(
    private snackbarService: SnackbarService
  ) { }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files as FileList;
    if (file) {
      this.imgName = file[0].name;
      const reader = new FileReader();
      const img = new Image();
      reader.onload = () => {
        img.src = reader.result as string;
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          if (width !== IMAGE_WIDTH && height !== IMAGE_HEIGHT) {
            this.snackbarService.showSnackbar('please select proper size of image', MessageType.danger);
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
      this.puzzlePieces.emit(pieces);
      this.pieceWidth.emit(imgWidth);
      this.pieceHeight.emit(imgHeight);
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

}
