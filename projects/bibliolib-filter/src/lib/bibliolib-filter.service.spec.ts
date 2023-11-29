import { TestBed } from '@angular/core/testing';

import { BibliolibFilterService } from './bibliolib-filter.service';

describe('BibliolibFilterService', () => {
  let service: BibliolibFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliolibFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
