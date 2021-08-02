import { TestBed } from '@angular/core/testing';

import { CollaboratorServiceService } from './collaborator-service.service';

describe('CollaboratorServiceService', () => {
  let service: CollaboratorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboratorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
