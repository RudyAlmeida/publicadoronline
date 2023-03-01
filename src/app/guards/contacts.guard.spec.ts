import { TestBed } from '@angular/core/testing';

import { ContactsGuard } from './contacts.guard';

describe('ContactsGuard', () => {
  let guard: ContactsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ContactsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
