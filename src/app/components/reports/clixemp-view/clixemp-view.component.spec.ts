import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClixempViewComponent } from './clixemp-view.component';

describe('ClixempViewComponent', () => {
  let component: ClixempViewComponent;
  let fixture: ComponentFixture<ClixempViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClixempViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClixempViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
