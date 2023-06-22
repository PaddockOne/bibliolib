import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliolibGalleryComponent } from './bibliolib-gallery.component';

describe('BibliolibGalleryComponent', () => {
  let component: BibliolibGalleryComponent;
  let fixture: ComponentFixture<BibliolibGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BibliolibGalleryComponent]
    });
    fixture = TestBed.createComponent(BibliolibGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
