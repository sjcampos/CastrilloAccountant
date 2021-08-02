import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorsResetComponent } from './collaborators-reset.component';

describe('CollaboratorsResetComponent', () => {
  let component: CollaboratorsResetComponent;
  let fixture: ComponentFixture<CollaboratorsResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorsResetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorsResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
