import { TestBed } from '@angular/core/testing';

import { TicketDetailsService } from './ticket-details.service';

describe('TicketDetailsService', () => {
  let service: TicketDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
