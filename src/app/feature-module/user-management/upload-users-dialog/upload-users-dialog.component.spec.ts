import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUsersDialogComponent } from './upload-users-dialog.component';

describe('UploadUsersDialogComponent', () => {
  let component: UploadUsersDialogComponent;
  let fixture: ComponentFixture<UploadUsersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadUsersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUsersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
