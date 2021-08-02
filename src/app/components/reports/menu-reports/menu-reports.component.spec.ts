import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuReportsComponent } from './menu-reports.component';

describe('MenuReportsComponent', () => {
  let component: MenuReportsComponent;
  let fixture: ComponentFixture<MenuReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
