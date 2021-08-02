import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxcViewComponent } from './cxc-view.component';

describe('CxcViewComponent', () => {
  let component: CxcViewComponent;
  let fixture: ComponentFixture<CxcViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CxcViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CxcViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
