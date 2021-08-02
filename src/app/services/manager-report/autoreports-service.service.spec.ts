import { TestBed } from '@angular/core/testing';

import { AutoreportsServiceService } from './autoreports-service.service';

describe('AutoreportsServiceService', () => {
  let service: AutoreportsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoreportsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
