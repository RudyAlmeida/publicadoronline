import { TestBed } from '@angular/core/testing';

import { CongregationService } from './congregation.service';

describe('CongregationService', () => {
  let service: CongregationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CongregationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
