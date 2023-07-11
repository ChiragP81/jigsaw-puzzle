import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
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

  receiveData(event: boolean): void {
    this.isOverPuzzle = event;
  }
}
