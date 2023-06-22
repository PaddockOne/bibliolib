import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-bibliolib-gallery',
  template: `
      <article
        class="gallery"
        [attr.nbr-photo]="
          photoList.length < 5
            ? photoList.length
            : 'carousel'
        "
      >
        <section
          class="img-wrapper"
          *ngFor="let photo of photoList; let i = index"
          [style]="i > 3 ? 'display: none;' : null"
          [attr.length]="photoList.length - 4 + '+'"
          (click)="toggleZoomPhoto($event, i)"
        >
          <img [src]="photo" />
        </section>
      </article>
      <article
          (click)="toggleZoomPhoto($event, 0)"
          class="gallery-zoom"
          *ngIf="toggleZoom"
        >
          <span (click)="prevPhoto()" class="prev-btn no-close"><</span>
          <img
            *ngFor="let pic of photoZoomGallery; let i = index"
            [src]="pic"
            [style]="i != currentPhotoZoom ? 'display: none;' : null"
          />
          <span (click)="nextPhoto()" class="next-btn no-close">></span>
        </article>
  `,
  styles: [
    `
    .gallery {
      width: 100%;
      gap: 0.3em;
    }
    .gallery>.img-wrapper {
      cursor: pointer;
    }
    .gallery>.img-wrapper>img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .gallery[nbr-photo="1"] {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 600px;
    }
    .gallery[nbr-photo="2"] {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 600px;
    }
    .gallery[nbr-photo="3"] {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 300px 300px;
    }
    .gallery[nbr-photo="3"]>.img-wrapper:nth-child(1) {
      grid-column: 1 / 2;
      grid-row: 1 / 3;
    }
    .gallery[nbr-photo="3"]>.img-wrapper:nth-child(2), 
    .gallery[nbr-photo="3"]>.img-wrapper:nth-child(3) {
      grid-column: 2 / 3;
    }
    .gallery[nbr-photo="3"]>.img-wrapper:nth-child(2) {
      grid-row: 1 / 2;
    }
    .gallery[nbr-photo="3"]>.img-wrapper:nth-child(3) {
      grid-row: 2 / 3;
    }
    .gallery[nbr-photo="4"],
    .gallery[nbr-photo="carousel"] {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 200px 200px 200px;
    }
    .gallery-zoom {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 1.25em;
      user-select: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .gallery-zoom>img {
        max-height: calc(100vh - 2.5em);
        max-width: calc(100vw - 120px - 2.5em);
        user-select: none;
    }
    .gallery-zoom>.prev-btn,
    .gallery-zoom>.next-btn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .gallery-zoom>.prev-btn:hover,
    .gallery-zoom>.next-btn:hover {
        background-color: rgba(255, 255, 255, 0.8);
    }
    `
  ]
})
export class BibliolibGalleryComponent {
  @Input() photoList!: string[];
  @Input() currentPhotoZoomGallery!: string[];

  currentPhotoZoom: number = 0;
  toggleZoom: boolean = false;
  photoZoomGallery: string[] = [];


  toggleZoomPhoto(event: Event, index: number) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('no-close')) {
      return
    }
    this.currentPhotoZoom = index;
    this.photoZoomGallery = this.currentPhotoZoomGallery || this.photoList;
    this.toggleZoom = !this.toggleZoom;
  }

  nextPhoto() {
    if (this.currentPhotoZoom < this.photoZoomGallery.length - 1) {
      this.currentPhotoZoom++;
    } else {
      this.currentPhotoZoom = 0;
    }
  }

  prevPhoto() {
    if (this.currentPhotoZoom > 0) {
      this.currentPhotoZoom--;
    } else {
      this.currentPhotoZoom = this.photoZoomGallery.length - 1;
    }
  }
}
