import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyViewComponent } from './proy-view.component';

describe('ProyViewComponent', () => {
  let component: ProyViewComponent;
  let fixture: ComponentFixture<ProyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
