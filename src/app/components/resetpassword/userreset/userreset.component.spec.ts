import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserresetComponent } from './userreset.component';

describe('UserresetComponent', () => {
  let component: UserresetComponent;
  let fixture: ComponentFixture<UserresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserresetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserresetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
