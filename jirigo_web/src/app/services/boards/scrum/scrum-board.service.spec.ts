import { TestBed } from '@angular/core/testing';

import { ScrumBoardService } from './scrum-board.service';

describe('ScrumBoardService', () => {
  let service: ScrumBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrumBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
