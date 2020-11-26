import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesSearchComponent } from './courses-search.component';

describe('CoursesSearchComponent', () => {
  let component: CoursesSearchComponent;
  let fixture: ComponentFixture<CoursesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursesSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
