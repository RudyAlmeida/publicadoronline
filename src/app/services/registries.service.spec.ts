import { TestBed } from '@angular/core/testing';

import { RegistriesService } from './registries.service';

describe('RegistriesService', () => {
  let service: RegistriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
