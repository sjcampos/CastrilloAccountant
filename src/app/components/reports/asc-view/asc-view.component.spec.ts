import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AscViewComponent } from './asc-view.component';

describe('AscViewComponent', () => {
  let component: AscViewComponent;
  let fixture: ComponentFixture<AscViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AscViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AscViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
