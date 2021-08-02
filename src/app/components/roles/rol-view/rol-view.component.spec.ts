import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolViewComponent } from './rol-view.component';

describe('RolViewComponent', () => {
  let component: RolViewComponent;
  let fixture: ComponentFixture<RolViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
