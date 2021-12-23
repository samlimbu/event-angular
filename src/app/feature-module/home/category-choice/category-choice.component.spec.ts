import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryChoiceComponent } from './category-choice.component';

describe('CategoryChoiceComponent', () => {
  let component: CategoryChoiceComponent;
  let fixture: ComponentFixture<CategoryChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryChoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
