import { TestBed } from '@angular/core/testing';

import { BibliolibGalleryService } from './bibliolib-gallery.service';

describe('BibliolibGalleryService', () => {
  let service: BibliolibGalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliolibGalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
