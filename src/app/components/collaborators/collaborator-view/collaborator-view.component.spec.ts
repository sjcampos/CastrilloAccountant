import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorViewComponent } from './collaborator-view.component';

describe('CollaboratorViewComponent', () => {
  let component: CollaboratorViewComponent;
  let fixture: ComponentFixture<CollaboratorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
