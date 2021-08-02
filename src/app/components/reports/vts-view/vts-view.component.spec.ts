import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtsViewComponent } from './vts-view.component';

describe('VtsViewComponent', () => {
  let component: VtsViewComponent;
  let fixture: ComponentFixture<VtsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VtsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
