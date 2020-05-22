import { TestBed } from '@angular/core/testing';

import { TaskLogtimeService } from './task-logtime.service';

describe('TaskLogtimeService', () => {
  let service: TaskLogtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskLogtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
