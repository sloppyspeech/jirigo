import { TestBed } from '@angular/core/testing';

import { TaskAuditService } from './task-audit.service';

describe('TaskAuditService', () => {
  let service: TaskAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
