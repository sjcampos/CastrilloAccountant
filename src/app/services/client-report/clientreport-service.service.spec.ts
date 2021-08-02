import { TestBed } from '@angular/core/testing';

import { ClientreportServiceService } from './clientreport-service.service';

describe('ClientreportServiceService', () => {
  let service: ClientreportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientreportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
