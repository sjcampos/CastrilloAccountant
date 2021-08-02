import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BGCViewComponent } from './bgc-view.component';

describe('BGCViewComponent', () => {
  let component: BGCViewComponent;
  let fixture: ComponentFixture<BGCViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BGCViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BGCViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
