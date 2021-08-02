import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EriViewComponent } from './eri-view.component';

describe('EriViewComponent', () => {
  let component: EriViewComponent;
  let fixture: ComponentFixture<EriViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EriViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EriViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
