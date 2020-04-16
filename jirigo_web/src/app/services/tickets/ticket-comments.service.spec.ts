import { TestBed } from '@angular/core/testing';

import { TicketCommentsService } from './ticket-comments.service';

describe('TicketCommentsService', () => {
  let service: TicketCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
