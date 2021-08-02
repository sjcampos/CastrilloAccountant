import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCollabComponent } from './company-collab.component';

describe('CompanyCollabComponent', () => {
  let component: CompanyCollabComponent;
  let fixture: ComponentFixture<CompanyCollabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyCollabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCollabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
