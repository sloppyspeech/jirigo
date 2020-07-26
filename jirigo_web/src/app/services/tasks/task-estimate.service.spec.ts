import { TestBed } from '@angular/core/testing';

import { TaskEstimateService } from './task-estimate.service';

describe('TaskEstimateService', () => {
  let service: TaskEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEstimateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
