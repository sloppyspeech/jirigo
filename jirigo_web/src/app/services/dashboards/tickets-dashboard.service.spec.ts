import { TestBed } from '@angular/core/testing';

import { TicketsDashboardService } from './tickets-dashboard.service';

describe('TicketsDashboardService', () => {
  let service: TicketsDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
