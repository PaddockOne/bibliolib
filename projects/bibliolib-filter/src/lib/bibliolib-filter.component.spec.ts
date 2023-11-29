import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliolibFilterComponent } from './bibliolib-filter.component';

describe('BibliolibFilterComponent', () => {
  let component: BibliolibFilterComponent;
  let fixture: ComponentFixture<BibliolibFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliolibFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BibliolibFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
