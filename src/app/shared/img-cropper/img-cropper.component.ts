import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '@services/snackbar.service';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
  selector: 'app-img-cropper',
  standalone: true,
  imports: [ImageCropperModule, MatDialogModule],
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.scss']
})
export class ImgCropperComponent {
  croppedImage: string | undefined | null = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImgCropperComponent>,
    public snackbarService: SnackbarService
  ) { }

  imageCropped(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }

  closeModal(): void {
    this.dialogRef.close(this.croppedImage);
  }

}
