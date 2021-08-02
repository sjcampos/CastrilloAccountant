import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReportsComponent } from './client-reports.component';

describe('ClientReportsComponent', () => {
  let component: ClientReportsComponent;
  let fixture: ComponentFixture<ClientReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
