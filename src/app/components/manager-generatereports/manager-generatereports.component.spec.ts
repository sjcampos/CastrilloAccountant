import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerGeneratereportsComponent } from './manager-generatereports.component';

describe('ManagerGeneratereportsComponent', () => {
  let component: ManagerGeneratereportsComponent;
  let fixture: ComponentFixture<ManagerGeneratereportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerGeneratereportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerGeneratereportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
