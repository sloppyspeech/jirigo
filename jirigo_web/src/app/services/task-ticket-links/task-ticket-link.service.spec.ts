import { TestBed } from '@angular/core/testing';

import { TaskTicketLinkService } from './task-ticket-link.service';

describe('TaskTicketLinkService', () => {
  let service: TaskTicketLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskTicketLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
