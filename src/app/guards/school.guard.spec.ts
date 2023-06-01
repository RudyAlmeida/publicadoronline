import { TestBed } from '@angular/core/testing';

import { SchoolGuard } from './school.guard';

describe('SchoolGuard', () => {
  let guard: SchoolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SchoolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
