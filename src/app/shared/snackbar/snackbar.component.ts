import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnackbarService } from '@services/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit, OnDestroy {
  show = false;
  message = 'Message Text';
  type = 'success';
  snackbarSubscription!: Subscription;

  constructor(
    private snackbarService: SnackbarService
  ) { }


  ngOnInit(): void {
    this.snackbarSubscription = this.snackbarService.snackbarState.subscribe(
      (state: any) => {
        this.type = state.type;
        this.message = state.message;
        this.show = state.show;
        setTimeout(() => {
          this.show = false;
        }, 2000);
      }
    )
  }

  ngOnDestroy(): void {
    this.snackbarSubscription.unsubscribe();
  }

}
