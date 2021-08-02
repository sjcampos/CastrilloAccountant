import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxpViewComponent } from './cxp-view.component';

describe('CxpViewComponent', () => {
  let component: CxpViewComponent;
  let fixture: ComponentFixture<CxpViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CxpViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CxpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
