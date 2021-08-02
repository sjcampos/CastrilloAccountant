import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorNavbarComponent } from './collaborator-navbar.component';

describe('CollaboratorNavbarComponent', () => {
  let component: CollaboratorNavbarComponent;
  let fixture: ComponentFixture<CollaboratorNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
