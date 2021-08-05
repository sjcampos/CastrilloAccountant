import { TestBed } from '@angular/core/testing';

import { AuthreportsGuard } from './authreports.guard';

describe('AuthreportsGuard', () => {
  let guard: AuthreportsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthreportsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
