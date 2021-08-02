import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BxcViewComponent } from './bxc-view.component';

describe('BxcViewComponent', () => {
  let component: BxcViewComponent;
  let fixture: ComponentFixture<BxcViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BxcViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BxcViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
