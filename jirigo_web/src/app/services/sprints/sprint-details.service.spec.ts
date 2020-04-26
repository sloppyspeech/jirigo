import { TestBed } from '@angular/core/testing';

import { SprintDetailsService } from './sprint-details.service';

describe('SprintDetailsService', () => {
  let service: SprintDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SprintDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
