import { TestBed } from '@angular/core/testing';

import { DataExtractsService } from './data-extracts.service';

describe('DataExtractsService', () => {
  let service: DataExtractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExtractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
