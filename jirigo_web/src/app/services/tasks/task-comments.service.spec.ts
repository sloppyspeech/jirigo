import { TestBed } from '@angular/core/testing';

import { TaskCommentsService } from './task-comments.service';

describe('TaskCommentsService', () => {
  let service: TaskCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
