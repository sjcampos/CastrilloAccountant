import { TestBed } from '@angular/core/testing';

import { AuthCollaGuard } from './auth-colla.guard';

describe('AuthCollaGuard', () => {
  let guard: AuthCollaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCollaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
