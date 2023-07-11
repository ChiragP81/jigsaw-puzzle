import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IMAGE_LIST_DATA } from 'src/app/core/constants/image.constant';
import { ImagesService } from 'src/app/core/services/images.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {

  imgPieces = IMAGE_LIST_DATA;
  images: any[] = [];
  dragged: any;
  over: boolean = false;

  @Output() isOver = new EventEmitter();

  constructor(
    public sanitizer: DomSanitizer,
    public imageService: ImagesService,
    public http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getImages();
  }

  getImages(): void {
    this.imageService.getImages().subscribe({
      next: (imgList: any) => {
        this.images = imgList;
      }
    })
  }

  onDrag(ev: DragEvent): void {
    ev.dataTransfer?.setData("index", (<HTMLElement>ev.target)?.id);
    this.dragged = ev.target;
  }

  onDrop(ev: any): void {
    ev.preventDefault();
    const dropTarget = document.getElementById(ev.target.id);

    if (dropTarget?.hasChildNodes()) {
      alert('You can not place two piece at same place');
      return;
    }
    if (dropTarget?.id === this.dragged.id) {
      this.imgPieces[this.dragged.id].misplaced = false;
    }
    const data = ev.dataTransfer.getData("index");
    const ele = document.getElementById(data);
    ele?.classList.remove('m-5');
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
