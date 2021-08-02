import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantDashboardComponent } from './accountant-dashboard.component';

describe('AccountantDashboardComponent', () => {
  let component: AccountantDashboardComponent;
  let fixture: ComponentFixture<AccountantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountantDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
