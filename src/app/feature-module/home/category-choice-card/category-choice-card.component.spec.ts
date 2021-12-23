import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryChoiceCardComponent } from './category-choice-card.component';

describe('CategoryChoiceCardComponent', () => {
  let component: CategoryChoiceCardComponent;
  let fixture: ComponentFixture<CategoryChoiceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryChoiceCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryChoiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
