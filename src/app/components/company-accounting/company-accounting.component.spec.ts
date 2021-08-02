import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAccountingComponent } from './company-accounting.component';

describe('CompanyAccountingComponent', () => {
  let component: CompanyAccountingComponent;
  let fixture: ComponentFixture<CompanyAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
