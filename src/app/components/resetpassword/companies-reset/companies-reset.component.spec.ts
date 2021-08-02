import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesResetComponent } from './companies-reset.component';

describe('CompaniesResetComponent', () => {
  let component: CompaniesResetComponent;
  let fixture: ComponentFixture<CompaniesResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniesResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
