import { TestBed } from '@angular/core/testing';

import { TicketAuditService } from './ticket-audit.service';

describe('TicketAuditService', () => {
  let service: TicketAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
