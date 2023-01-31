import { TestBed } from '@angular/core/testing';

import { IntervalCheckerService } from './interval-checker.service';

describe('IntervalCheckerService', () => {
  let service: IntervalCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervalCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
